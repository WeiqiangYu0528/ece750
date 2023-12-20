package ece750.backend.user.service;

import ece750.backend.user.domain.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    Media UpdateUserByAvatar(String username, MultipartFile avatar) throws IOException;
    User FindUserByUsername(String username);
    List<User> FindUserBykeyword(String keyword);
    List<User> AllUsers();
    User FindUserByUserId(String id);
    String AddUserFollowList(String currentUserName, String targetUserName);
    String DeleteUserFollowList(String currentUserName, String targetUserName);
    void savePost(String username, String postId);
    void cancelSavePost(String username, String postId);
    void updateUserProfile(String originUsername, String fullname, String username, String email, String phone, String gender);
    Integer changePwd(String username, String oldPwd, String newPwd);

    void setFollowers(User user);

    void setFollowing(User user);

    Media FindAvatarByUsername(String username);

    void updateUserAvatar(User user);

    byte[] getUserAvatar(String filename);

    String setUserAvatar(MultipartFile avatar);

    List<Post> getUserPosts(User user, int loadedNumber);

    void setLoadingNumber(int loadingNumber);
}
