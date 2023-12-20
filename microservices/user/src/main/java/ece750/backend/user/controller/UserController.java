package ece750.backend.user.controller;

import ece750.backend.user.domain.*;
import ece750.backend.user.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import ece750.backend.user.util.ResponseFormat;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/recommend/{username}")
    public ResponseEntity<User> recommendFollowUser(@PathVariable String username){
        List<Searchbody> list = new ArrayList<>();

        //get the userlist that the user has followed
        User search_user = userService.FindUserByUsername(username);
        List<String> followlist = search_user.getFollows();

        List<User> all_users = userService.AllUsers();

        for(int index = 0;index<all_users.size();index++){
            if (list.size() == 3)
                break;
            User cur_user = all_users.get(index);
            Boolean flag = false;
            if(followlist != null) {
                for (int ii = 0; ii < followlist.size(); ii++) {
                    String user_follow = followlist.get(ii);
                    //System.out.println(cur_user.getUsername()+" "+user_follow.getUsername());
                    if (Objects.equals(cur_user.getId(), user_follow))
                        flag = true;
                }
            }
            if(flag == false && !cur_user.getUsername().equals(username)){
                Searchbody searchbody = new Searchbody(cur_user.getAvatar(),flag,cur_user.getUsername());
                list.add(searchbody);
            }


        }


        ResponseEntity response = new ResponseEntity<>(list,HttpStatus.OK);
        return response;
    }

    @PostMapping("/search/{username}")
    public ResponseEntity<User> searchUser(@RequestBody Map<String,List<String>> body,@PathVariable String username){
        List<Searchbody> list = new ArrayList<>();
        List<String> keywords = body.get("keywords");

        User search_user = userService.FindUserByUsername(username);

        for(int i=0;i<keywords.size();i++){
            if(keywords.get(i) == "")
                continue;
            List<User> list1 = userService.FindUserBykeyword(keywords.get(i));
            for(int j=0;j<list1.size();j++){
                User cur_user = list1.get(j);
                List<String> followlist = search_user.getFollows();
                Boolean flag = false;
                if(followlist != null) {
                    for (int ii = 0; ii < followlist.size(); ii++) {
                        String user_follow = followlist.get(ii);
                        //System.out.println(cur_user.getUsername()+" "+user_follow.getUsername());
                        if (Objects.equals(cur_user.getId(), user_follow))
                            flag = true;
                    }
                }
                if(cur_user.getAvatar() != null){
                    Media media = cur_user.getAvatar();
                    media.setData(userService.getUserAvatar(media.getFilename()));
                }
                Searchbody searchbody = new Searchbody(cur_user.getAvatar(),flag,cur_user.getUsername());
                if(!list.contains(searchbody) && !Objects.equals(cur_user.getId(), search_user.getId())){
                    list.add(searchbody);
                }
            }
        }
        System.out.println(list.size());
        ResponseEntity response = new ResponseEntity<>(list,HttpStatus.OK);
        return response;
    }

    @PostMapping("/changeAva")
    public ResponseEntity<ResponseFormat> changeAvatar(@RequestParam("username") String username, @RequestParam("avatar") MultipartFile avatar) throws IOException {
        System.out.println(username);
        System.out.println(avatar);
        Media media = userService.UpdateUserByAvatar(username, avatar);
        ResponseFormat responseFormat = new ResponseFormat(media,1,"success");
        return new ResponseEntity<>(responseFormat,HttpStatus.OK);
    }

    @GetMapping("/{username}/avatar")
    public ResponseEntity<Media> getAvatar(@PathVariable String username) throws IOException {
        System.out.println(username);
        Media media = userService.FindAvatarByUsername(username);
        return new ResponseEntity<>(media,HttpStatus.OK);
    }

    @PostMapping("/profile")
    public ResponseEntity<User> getUser(@RequestBody Map<String, String> body) throws IOException {
        System.out.println("Call profile");
        int loadedNumber = Integer.parseInt(body.get("loadedNumber"));
        String username = body.get("username");
        User user = userService.FindUserByUsername(username);
        if(user != null){
            userService.updateUserAvatar(user);
            user.setPosts(userService.getUserPosts(user, loadedNumber));
            userService.setFollowing(user);
            userService.setFollowers(user);
        }
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @PostMapping("/setFollow")
    public ResponseEntity<String> setFollow(@RequestBody Map<String,String> body){

        String response = userService.AddUserFollowList(body.get("currentUserName"),body.get("targetUserName"));
        ResponseEntity response1 = new ResponseEntity<>(response,HttpStatus.OK);
        return response1;
    }

    @PostMapping("/cancelFollow")
    public ResponseEntity<String> cancelFollow(@RequestBody Map<String,String> body){

        String response = userService.DeleteUserFollowList(body.get("currentUserName"),body.get("targetUserName"));
        ResponseEntity response1 = new ResponseEntity<>(response,HttpStatus.OK);
        return response1;
    }

    @PostMapping("/save")
    public ResponseEntity<String> addSave(@RequestBody Map<String,String> body){
        String username = body.get("username");
        String post_id = body.get("post_id");
        Boolean saved =  Boolean.parseBoolean(body.get("save"));
        System.out.println(username+" "+post_id+" "+saved);
        if(saved) userService.savePost(username,post_id);
        else userService.cancelSavePost(username,post_id);
        return new ResponseEntity<>("success",HttpStatus.OK);
    }

    @PostMapping("/update/{originUsername}")
    public ResponseEntity<ResponseFormat> updateUser(@PathVariable String originUsername, @RequestParam("fullname") String fullname, @RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("phone") String phone, @RequestParam("gender") String gender) throws IOException {
        userService.updateUserProfile(originUsername, fullname, username, email, phone, gender);
        ResponseFormat responseFormat = new ResponseFormat("",1,"success");
        return new ResponseEntity<>(responseFormat,HttpStatus.OK);
    }

    @PostMapping("/changePwd/{username}")
    public ResponseEntity<ResponseFormat> changePwd(@PathVariable String username, @RequestParam("oldPwd") String oldPwd, @RequestParam("newPwd") String newPwd) throws IOException {
        Integer resultCode = userService.changePwd(username, oldPwd, newPwd);
        ResponseFormat responseFormat = null;
        if(resultCode == 1){
            responseFormat = new ResponseFormat("",1,"success");
        }
        else if(resultCode == 2){
            responseFormat = new ResponseFormat("",2,"fail: the old password is incorrect");
        }
        return new ResponseEntity<>(responseFormat,HttpStatus.OK);
    }

    @GetMapping("/avatar/{username}")
    public ResponseEntity<Media> getAvatarMedia(@PathVariable String username) throws IOException {
        Media avatar = null;
        User user = userService.FindUserByUsername(username);
        if(user != null){
            avatar = user.getAvatar();
        }
        return new ResponseEntity<>(avatar, HttpStatus.OK);
    }

    @GetMapping("/u/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) throws IOException {
        User user = userService.FindUserByUsername(username);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/uid/{id}")
    public ResponseEntity<User> getUserByUserId(@PathVariable String id) throws IOException {
        User user = userService.FindUserByUserId(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() throws IOException {
        List<User> all_users = userService.AllUsers();
        return new ResponseEntity<>(all_users, HttpStatus.OK);
    }

    @PostMapping("/setLoadingNumber")
    public ResponseEntity<String> setLoadingNumber(@RequestParam("loadingNumber") String loadingNumber) throws IOException {
        userService.setLoadingNumber(Integer.parseInt(loadingNumber));
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }
}
