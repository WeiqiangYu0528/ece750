package ece750.backend.authentication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.codec.binary.Hex;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;

import ece750.backend.authentication.domain.*;
import ece750.backend.authentication.service.AuthServiceImpl;


@CrossOrigin
@RestController
@RequestMapping("/auth")
public class authController {
    @Autowired
    private AuthServiceImpl authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String,String> user) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        System.out.println(user);
        User user1 = new User();

        String email = user.get("emailAddress");
        String username = user.get("username");
        String fullname = user.get("fullName");
        String password = user.get("password");

        if (username == "" || password == "" || fullname == "" || email == "") {
            return new ResponseEntity<>("Error NUll value", HttpStatus.UNAUTHORIZED);
        }

        User current_user = authService.FindUserByUsername(username);
        if(current_user != null){
            System.out.println("Duplicate Username");
            return new ResponseEntity<>("username duplicate", HttpStatus.UNAUTHORIZED);
        }
        List<User> userlist2 = authService.FindUserByEmail(email);
        if(userlist2.size() != 0){
            System.out.println("Duplicate Email");
            return new ResponseEntity<>("email duplicate", HttpStatus.UNAUTHORIZED);
        }
        //user1.setId(user.get("id"));
        password = encode_password(password);
        System.out.println(password);
        user1.setEmail(email);
        user1.setUsername(username);
        user1.setPassword(password);
        user1.setFullname(fullname);
        authService.AddUser(user1);
        return new ResponseEntity<>("register successful", HttpStatus.OK);
    }

    @PostMapping("/login" )
    public ResponseEntity<User> loginUser(@RequestBody Map<String,String> user) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        String username = user.get("username");
        String password = user.get("password");
        if (username == null || password == null) {
            return new ResponseEntity<>(new User(), HttpStatus.UNAUTHORIZED);
        }
        password = encode_password(password);
        System.out.println(password);
        User cur_user = authService.FindUserByUsername(username);
//        for(int i=0;i<userlist.size();i++){
//            User current_user = userlist.get(i);
        if(cur_user != null){
            String cur_username = cur_user.getUsername();
            String cur_password = cur_user.getPassword();
            if (cur_password.equals(password)){
                if(cur_user.getAvatar() != null){
                    Media media = cur_user.getAvatar();
                    media.setData(authService.getUserAvatar(media.getFilename()));
                }
                return new ResponseEntity<>(cur_user, HttpStatus.OK);
            }
        }

        List<User> userlist1 = authService.FindUserByEmail(username);
        for(int i=0;i<userlist1.size();i++) {
            User current_user = userlist1.get(i);
            //String cur_username = current_user.getUsername();
            String cur_password = current_user.getPassword();
            //System.out.println(password);
            //System.out.println(cur_username+" "+cur_password);
            if (cur_password.equals(password)) {
                return new ResponseEntity<>(current_user, HttpStatus.OK);
            }
        }

        return new ResponseEntity<>(new User(),HttpStatus.UNAUTHORIZED);

        //return new ResponseEntity<>("Not found this user in the system", HttpStatus.UNAUTHORIZED);
    }

    //SHA1算法
    public String encode_password(String str) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        md.update(str.getBytes("utf-8"));
        byte[] digest = md.digest();
        return String.valueOf(Hex.encodeHex(digest));
    }
}
