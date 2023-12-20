package ece750.backend.user.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@ToString
@Builder
@AllArgsConstructor
@Document(collection = "comment")
public class Comment {
    private String id;

    private String username;

    private Media avatar;
    private String comment;
    private Date time_created;
    @DBRef
    private List<String> likes;
    @DBRef
    private List<Comment> replies;

    public Comment(){
    }

    public Comment(String username, String comment) {
        this.username = username;
        this.comment = comment;
        this.id = new ObjectId().toHexString();
        this.time_created = new Date();
    }
}
