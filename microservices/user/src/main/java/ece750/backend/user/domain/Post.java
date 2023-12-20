package ece750.backend.user.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@ToString
@Builder
@AllArgsConstructor
@Document(collection = "post")
public class Post {
    @Id
    private String id;
    private String username;

    private Media avatar;
    private String caption;
    private String location;
    private Date time_created;
    private Date time_modified;

    @DBRef
    private List<Media> mediaList;

    private List<String> likes;

    @DBRef
    private List<Comment> comments;

    private Boolean whether_liked;
    private Boolean whether_saved;
    private Boolean whether_followed_post_user;

    private String[] hashtags;

    public Post() {
    }

    public Post(String username, String caption, List<Media> mediaList) {
        this.username = username;
        this.caption = caption;
        this.mediaList = mediaList;
        this.id = new ObjectId().toHexString();
        this.time_created = new Date();
        this.time_modified = new Date();
    }
}
