package ece750.backend.post.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "media")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Media {
    @Id
    private String id;

    private String filename;

    private String type;
    private byte[] data;

    public Media(String filename) {
        this.id = new ObjectId().toHexString();
        this.filename = filename;
    }

    public Media(String filename, String type) {
        this.id = new ObjectId().toHexString();
        this.filename = filename;
        this.type = type;
    }
}

