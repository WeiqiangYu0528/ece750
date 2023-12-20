package ece750.backend.user.service;

import ece750.backend.user.domain.*;
import com.mongodb.client.result.UpdateResult;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {
    @Resource
    private MongoTemplate mongoTemplate;

    private int loadingNumber;

    private static final String COLLECTION_NAME = "user";

    private final WebClient webClient;

    public UserServiceImpl(@Value("${serviceHost}") String serviceHost,
                           @Value("${servicePort}") String servicePort,
                           @Value("${serviceUri}") String serviceUri,
                           WebClient.Builder webClientBuilder) {
        this.loadingNumber = 18;
        final int size = Integer.MAX_VALUE;
        final String url = "http://" + serviceHost + ":" + servicePort + "/" + serviceUri;
        final ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();
        this.webClient = webClientBuilder.baseUrl(url)
                .exchangeStrategies(strategies)
                .build();
    }

    @Override
    public Media UpdateUserByAvatar(String username, MultipartFile avatar) throws IOException {
        Media media = new Media(setUserAvatar(avatar));
        Criteria criteria = Criteria.where("username").is(username);
        Query query = new Query(criteria);
        //find the user
        User user = mongoTemplate.find(query, User.class, COLLECTION_NAME).get(0);
//        if the avatar not exist
        if (user.getAvatar() == null) {
            mongoTemplate.insert(media);
            Update update = new Update().set("avatar", media.getId());
            UpdateResult result = mongoTemplate.updateFirst(query, update, User.class, "user");
        }
        //if the avatar exist
        else {
            Media prevMedia = user.getAvatar();
            mongoTemplate.update(Media.class).matching(Criteria.where("_id").is(prevMedia.getId()))
                    .apply(new Update().set("filename", avatar.getOriginalFilename()))
                    .first();
        }
        media.setData(getUserAvatar(avatar.getOriginalFilename()));
        return media;
    }

    @Override
    public User FindUserByUsername(String username) {
        Criteria criteria = Criteria.where("username").is(username);
        Query query = new Query(criteria);
        User user = mongoTemplate.findOne(query, User.class, COLLECTION_NAME);
        return user;
    }

    @Override
    public List<User> FindUserBykeyword(String keyword) {
        Pattern pattern= Pattern.compile("^.*"+keyword+".*$", Pattern.CASE_INSENSITIVE);
        Query query = new Query(Criteria.where("username").regex(pattern));
        List<User> documentList = mongoTemplate.find(query, User.class, COLLECTION_NAME);
        return documentList;
    }

    @Override
    public List<User> AllUsers() {
        return mongoTemplate.findAll(User.class,"user");
    }

    @Override
    public User FindUserByUserId(String id) {
        Criteria criteria = Criteria.where("_id").is(id);
        Query query = new Query(criteria);
        List<User> documentList = mongoTemplate.find(query, User.class, COLLECTION_NAME);
        return documentList.get(0);
    }

    @Override
    public String AddUserFollowList(String currentUserName, String targetUserName) {

        User targetUser = FindUserByUsername(targetUserName);
        User currentUser = FindUserByUsername(currentUserName);

        //Add curr_user into targetuser's followee list
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(targetUserName));

        Update update1 = new Update();
        update1.addToSet("followees",currentUser.getId());

        mongoTemplate.updateFirst(query, update1, User.class);

        //Add target_user into curr_user's follow list
        Query query1 = new Query();
        query1.addCriteria(Criteria.where("username").is(currentUserName));

        Update update2 = new Update();
        update2.addToSet("follows",targetUser.getId());

        mongoTemplate.updateFirst(query1, update2, User.class);

        return "successful";
    }

    @Override
    public String DeleteUserFollowList(String currentUserName, String targetUserName) {
        User targetUser = FindUserByUsername(targetUserName);
        User currentUser = FindUserByUsername(currentUserName);

        //Delete curr_user into targetuser's followee list
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(targetUserName));

        Update update1 = new Update();
        update1.pull("followees",currentUser.getId());

        mongoTemplate.updateFirst(query, update1, User.class);

        //Delete target_user into curr_user's follow list
        Query query1 = new Query();
        query1.addCriteria(Criteria.where("username").is(currentUserName));

        Update update2 = new Update();
        update2.pull("follows",targetUser.getId());

        mongoTemplate.updateFirst(query1, update2, User.class);

        return "successful";
    }

    @Override
    public void savePost(String username, String id){
        mongoTemplate.update(User.class).matching(Criteria.where("username").is(username))
                .apply(new Update().push("saved_posts").value(id))
                .first();
    }
    @Override
    public void cancelSavePost(String username, String id){
        mongoTemplate.update(User.class).matching(Criteria.where("username").is(username))
                .apply(new Update().pull("saved_posts", id)).first();
    }

    @Override
    public void setFollowing(User user){
        List<Searchbody> followingList = new ArrayList<>();
        if(user.getFollows() != null){
            for(String id: user.getFollows()){
                User following = FindUserByUserId(id);
                updateUserAvatar(following);
                followingList.add(new Searchbody(following.getAvatar(),true, following.getUsername(),following.getFullname()));
            }
        }
        user.setFollowing(followingList);
    }

    @Override
    public void setFollowers(User user){
        List<Searchbody> followerList = new ArrayList<>();
        if(user.getFollowees() != null){
            for(String id: user.getFollowees()){
                User follower = FindUserByUserId(id);
                updateUserAvatar(follower);
                boolean isFollowing = false;
                if(user.getFollows() != null){
                    for(String oid: user.getFollows()){
                        if(id.equals(oid)) {
                            isFollowing = true;
                            break;
                        }
                    }
                }
                followerList.add(new Searchbody(follower.getAvatar(), isFollowing, follower.getUsername(), follower.getFullname()));
            }
        }
        user.setFollowers(followerList);
    }

    @Override
    public Media FindAvatarByUsername(String username) {
        Criteria criteria = Criteria.where("username").is(username);
        Query query = new Query(criteria);
        Media media = mongoTemplate.findOne(query, User.class, "user").getAvatar();
        if(media != null){
            media.setData(getUserAvatar(media.getFilename()));
        }
        return media;
    }

    @Override
    public void updateUserAvatar(User user) {
        if (user.getAvatar() != null) {
            Media media = user.getAvatar();
            media.setData(getUserAvatar(media.getFilename()));
        }
    }

    @Override
    public void updateUserProfile(String originUsername, String fullname, String username, String email, String phone, String gender) {
        Update update = new Update();
        update.set("fullname",fullname);
        update.set("username",username);
        update.set("email",email);
        update.set("phoneNumber",phone);
        update.set("gender",gender);

        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(originUsername));
        User user = mongoTemplate.find(query, User.class, COLLECTION_NAME).get(0);

        mongoTemplate.update(User.class).matching(Criteria.where("_id").is(user.getId()))
                .apply(update)
                .first();
    }

    @Override
    public Integer changePwd(String username, String oldPwd, String newPwd) {
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(username));
        User user = mongoTemplate.find(query, User.class, COLLECTION_NAME).get(0);
        if(user.getPassword().equals(oldPwd)){
            mongoTemplate.update(User.class).matching(Criteria.where("username").is(username))
                    .apply(new Update().set("password",newPwd))
                    .first();
            return 1;
        }else{
            return 2;
        }
    }


    @Override
    public byte[] getUserAvatar(String filename) {
        return this.webClient.get()
                .uri("/media/{filename}", filename)
                .retrieve()
                .bodyToMono(byte[].class) // Assuming the response is in byte array format
                .block(); // Blocking for simplicity; use subscribe() in non-blocking scenarios
    }

    @Override
    public String setUserAvatar(MultipartFile avatar) {
        return this.webClient.post()
                .uri("/media")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("media", avatar.getResource()))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @Override
    public List<Post> getUserPosts(User user, int loadedNumber) {
        String username = user.getUsername();
        Media avatar = user.getAvatar();
        int loadingNumber = loadedNumber + this.loadingNumber;
        System.out.println("Load " + loadingNumber + " images from " + username);
        ProfileBody request = new ProfileBody(username, avatar, loadingNumber);
        return this.webClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(Post.class)  // Assuming the response is a list of posts
                .collectList()
                .block(); // Blocking for simplicity; use subscribe() in non-blocking scenarios
    }

    @Override
    public void setLoadingNumber(int loadingNumber) {
        this.loadingNumber = loadingNumber;
    }
}
