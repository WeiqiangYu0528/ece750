package ece750.backend.authentication.service;

import ece750.backend.authentication.domain.*;
import java.util.List;

public interface AuthService {
    User AddUser(User user);
    User FindUserByUsername(String username);
    List<User> FindUserByEmail(String email);
    byte[] getUserAvatar(String filename);
}
