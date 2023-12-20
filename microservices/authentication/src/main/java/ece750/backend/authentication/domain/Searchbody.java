package ece750.backend.authentication.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;


@Data
@NoArgsConstructor
public class Searchbody {
    private Media avatar;
    private boolean isFollowing;
    private String username;
    private String fullname;
    public Searchbody(Media avatar, boolean isFollowing, String username){
        this.avatar =avatar;
        this.isFollowing =isFollowing;
        this.username = username;
    }

    public Searchbody(Media avatar, String username, String fullname){
        this.avatar = avatar;
        this.username = username;
        this.fullname = fullname;
    }

    public Searchbody(Media avatar, boolean isFollowing, String username, String fullname) {
        this.avatar = avatar;
        this.isFollowing = isFollowing;
        this.username = username;
        this.fullname = fullname;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Searchbody))
            return false;
        Searchbody userNode = (Searchbody) o;
        return Objects.equals(username, userNode.username);
    }
}
