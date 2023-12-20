package ece750.backend.post.service;

import ece750.backend.post.domain.Media;
import jakarta.annotation.Resource;
import org.bson.types.ObjectId;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ibm.cloud.objectstorage.services.s3.AmazonS3;
import com.ibm.cloud.objectstorage.services.s3.model.*;
import com.ibm.cloud.objectstorage.util.IOUtils;

import org.springframework.beans.factory.annotation.Value;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.ImageIO;

@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class MediaService {

    @Value("${bucketName}")
    private String bucketName;

    private String resolution;

    @Resource
    private MongoTemplate mongoTemplate;

    private final AmazonS3 s3;

    public MediaService(AmazonS3 s3){
        this.s3 = s3;
        this.resolution = "high";
    }

    public List<Media> createMediaList(MultipartFile[] files) throws IOException {
        List<Media> mediaList = new ArrayList<>();
        for(MultipartFile file: files){
            String filetype = file.getContentType().substring(0,5);
            Media media = new Media(saveFile(file), filetype);
            mediaList.add(media);
        }
        return mediaList;
    }


    public String saveFile(MultipartFile file){
        String filename = file.getOriginalFilename();

        String[] filenames = getImageName(filename);
        String nameWithoutExtension = filenames[0];
        String originalFormat = filenames[1];

        try {
            File newFile = convertMultiPartToFile(file);
            File lowResolutionFile = convertImageToLowResolution(newFile, originalFormat);
            String highResolutionFilename = nameWithoutExtension + "_high." + originalFormat;
            String lowResolutionFilename = nameWithoutExtension + "_low." + originalFormat;
            s3.putObject(bucketName, highResolutionFilename, newFile);
            s3.putObject(bucketName, lowResolutionFilename, lowResolutionFile);
            System.out.println("Create new images!!!");
            return filename;
        }
        catch(IOException e){
            throw new RuntimeException(e);
        }
    }

    @Cacheable(value="mediaCache", key = "#filename")
    public byte[] downloadFile(String filename){

        String[] filenames = getImageName(filename);
        String nameWithoutExtension = filenames[0];
        String originalFormat = filenames[1];
        filename = nameWithoutExtension + "_" + this.resolution + "." + originalFormat;

        System.out.println("New request with " + filename);
        S3Object s3Object = s3.getObject(bucketName, filename);
        S3ObjectInputStream objectContent = s3Object.getObjectContent();
        try {
            return IOUtils.toByteArray(objectContent);
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @CacheEvict(value="mediaCache", key = "#p0")
    public void deleteFile(Media media){
        ObjectId id = new ObjectId(media.getId());
        String filename = media.getFilename();
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        mongoTemplate.remove(query,Media.class,"media");
        s3.deleteObject(bucketName, filename);
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException{
        System.out.println(file.getOriginalFilename());
        File newFile = new File(file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(newFile);
        fos.write(file.getBytes());
        fos.close();
        return newFile;
    }

    private File convertImageToLowResolution(File file, String originalFormat) throws IOException{
        try {
            BufferedImage originalImage = ImageIO.read(file);
            int newWidth = originalImage.getWidth() / 2;
            int newHeight = originalImage.getHeight() / 2;
            BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, originalImage.getType());
            Graphics2D g2d = resizedImage.createGraphics();
            Image scaledImage = originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
            g2d.drawImage(scaledImage, 0, 0, null);
            g2d.dispose();

            String originalFileName = file.getName();
            File outputFile = File.createTempFile(originalFileName, "." + originalFormat);
            ImageIO.write(resizedImage, originalFormat, outputFile);
            System.out.println("Image downsampling completed.");
            return outputFile;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    private String[] getImageName(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        String nameWithoutExtension = (dotIndex == -1) ? filename : filename.substring(0, dotIndex);
        String originalFormat = (dotIndex == -1 || dotIndex >= filename.length() - 1) ? "" : filename.substring(dotIndex + 1);
        return new String[]{nameWithoutExtension, originalFormat};
    }
}
