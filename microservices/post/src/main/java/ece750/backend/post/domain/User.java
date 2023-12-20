package ece750.backend.post.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@ToString
@Builder
@AllArgsConstructor
@Document(collection = "user")
public class User {
    @Id
    private String id;
    private String email;
    private String country;
    private String phoneNumber;
    private String password;
    private String username;
    private String first_name;
    private String last_name;
    private String gender;
    private String dateOfBirth;
    @DBRef
    private Media avatar;
    private String last_login;
    private String is_blocked;
    private String time_created;
    private String fullname;
    private List<String> followees;
    private List<String> follows;
    private List<Searchbody> followers;
    private List<Searchbody> following;
    private List<String> postIds;
    private List<Post> posts;
    private List<String> saved_posts;
    private List<String> like_posts;
    private List<String> like_comments;
    public User() {
        this.follows = new ArrayList<String>() ;
        this.followees = new ArrayList<String>() ;
        this.like_posts = new ArrayList<String>() ;
        this.saved_posts = new ArrayList<String>() ;
    }
}
