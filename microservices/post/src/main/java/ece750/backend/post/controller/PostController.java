package ece750.backend.post.controller;

import ece750.backend.post.domain.*;
import ece750.backend.post.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;


@RestController
@CrossOrigin
@RequestMapping("/post")
public class PostController {
    @Autowired
    private PostService postService;

    @Autowired
    private HashtagService hashtagService;

    @Autowired
    private MediaService mediaService;
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(){
        List<Post> posts = postService.allPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/home/{username}")
    public ResponseEntity<Homepage> HomepagePosts(@PathVariable String username){
        User currentUser = postService.getUserByUsername(username);
        Media avatar = currentUser.getAvatar();
        if(avatar != null){
            avatar.setData(mediaService.downloadFile(avatar.getFilename()));
        }

        List<String> followlist = currentUser.getFollows();
        List<Post> posts = new ArrayList<>();
        //First add follow's posts into posts list.
        if(followlist!=null){
            for(int j=0;j<followlist.size();j++){
                User cur_follow = postService.getUserByUserId(followlist.get(j));
                String cur_follow_username = cur_follow.getUsername();
                Media media = cur_follow.getAvatar();
                if (media != null) {
                    media.setData(mediaService.downloadFile(media.getFilename()));
                }
                List<Post> cur_follow_post_list = postService.getPostsByUser(cur_follow_username, media, 6);
                posts.addAll(cur_follow_post_list);
            }
        }
        //Second add himself's posts into posts list.
        List<Post> cur_follow_post_list = postService.getPostsByUser(username, avatar, 6 );
        posts.addAll(cur_follow_post_list);
//        //if the size<10, add it until 10.
//        if(posts.size()<10){
//            List<Post> AllPosts = postService.allPosts();
//            for(int index=0;index<AllPosts.size();index++){
//                Post cur_post = AllPosts.get(index);
//                if(!posts.contains(cur_post)){
//                    posts.add(cur_post);
//                    if(posts.size()>=10)
//                        break;
//                }
//            }
//        }

        List<String> like_posts = currentUser.getLike_posts();
        List<String> follow_user_id_list = currentUser.getFollows();
        List<String> saved_posts = currentUser.getSaved_posts();

        for(Post post: posts){
            String oid = post.getId();
            if(saved_posts != null){
                for(String saved_id: saved_posts){
                    if(Objects.equals(saved_id, oid)){
                        post.setWhether_saved(true);
                        break;
                    }
                }
            }
        }

        List<Post> posts_include_whether_liked= new ArrayList<>();
        if(like_posts != null) {
            for (int i = 0; i < posts.size(); i++) {
                Boolean whether_liked = false;
                Boolean whether_followed = false;

                Post cur_post = posts.get(i);
                String cur_post_owner_id = postService.getUserByUsername(cur_post.getUsername()).getId();

                for(int index=0;index<like_posts.size();index++){
                    if(Objects.equals(like_posts.get(index),cur_post.getId())){
                        whether_liked = true;
                    }
                }

                if(follow_user_id_list!= null){
                    if (follow_user_id_list.contains(cur_post_owner_id) || cur_post_owner_id.equals(currentUser.getId()))
                        whether_followed = true;
                }

                cur_post.setWhether_followed_post_user(whether_followed);
                cur_post.setWhether_liked(whether_liked);
                //homebody home_post = new homebody(cur_post,whether_liked,whether_followed);
                posts_include_whether_liked.add(cur_post);
            }
        }
        else{
            for (int i = 0; i < posts.size(); i++) {
                Boolean whether_liked = false;
                Post cur_post = posts.get(i);

                String cur_post_owner_id = postService.getUserByUsername(cur_post.getUsername()).getId();
                Boolean whether_followed = false;
                if(follow_user_id_list!= null){
                    if (follow_user_id_list.contains(cur_post_owner_id) || cur_post_owner_id.equals(currentUser.getId()))
                        whether_followed = true;
                }
                //homebody home_post = new homebody(cur_post,whether_liked,whether_followed);
                cur_post.setWhether_followed_post_user(whether_followed);
                cur_post.setWhether_liked(whether_liked);
                posts_include_whether_liked.add(cur_post);
            }
        }
        System.out.println(posts_include_whether_liked.size());
        Homepage homepage = new Homepage(posts_include_whether_liked, get_recommend_follow_list(username));
        ResponseEntity response = new ResponseEntity<>(homepage,HttpStatus.OK);
        return response;
    }

    @PostMapping
    public ResponseEntity<List<Post>> getPosts(@RequestBody ProfileBody profile){
        String username = profile.getUsername();
        Media avatar = profile.getAvatar();
        int loadingNumber = profile.getLoadingNumber();
        List<Post> posts = postService.getPostsByUser(username, avatar, loadingNumber);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/explore/{username}")
    public ResponseEntity<List<Post>> getExplorePosts(@PathVariable String username){
        System.out.println("explore " + username);
        //User user = userService.FindUserByUsername(username);
        //List<Post> posts = postService.getPostsByUser(user);
        List<Post> allposts = postService.allPosts();
        List<Post> posts = new ArrayList<>();
        for(int index=0; index<allposts.size();index++){
            Post currentPost = allposts.get(index);
            if(!currentPost.getUsername().equals(username)){
                postService.updatePostMedia(currentPost);
                posts.add(currentPost);
            }
        }
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

//    @GetMapping("/{userid}")
//    public ResponseEntity<List<Post>> getSinglePostByUserId(@PathVariable String userid){
//        System.out.println(userid);
//        //String userid = user.get("userid");
//        List<Post> posts = postService.getPostsByUserId(userid);
//        return new ResponseEntity<>(posts, HttpStatus.OK);
//    }


    @PostMapping("/comment")
    public ResponseEntity<Comment> createComment(@RequestBody Map<String,String> payload){
        User user = postService.getUserByUsername(payload.get("username"));
        String comment = payload.get("comment");
        String postId = payload.get("id");
        String commentId = payload.get("commentId");
        boolean reply = payload.get("reply").length() > 0;
        if(reply){
            return new ResponseEntity<>(postService.updateCommentByComment(user,comment, commentId),HttpStatus.CREATED);
        }else{
            return new ResponseEntity<>(postService.updatePostByComment(user,comment,postId),HttpStatus.CREATED);
        }
    }

    @PostMapping("/{username}")
    public ResponseEntity<Post> createPost(@PathVariable String username, @RequestParam("media") MultipartFile[] media,
                                           @RequestParam("caption") String caption, @RequestParam("hashtags") String hashtags) throws IOException {
        System.out.println(username);
        User user = postService.getUserByUsername(username);
        Post post = postService.newPost(user, caption, media, hashtags);
        return new ResponseEntity<>(post,HttpStatus.CREATED);
    }

    @GetMapping("/hashtags/{hashtag}")
    public ResponseEntity<List<Post>> getPostsByHashtag(@PathVariable String hashtag){
        System.out.println(hashtag);
        List<Post> posts = postService.getPostsByHashtag(hashtag);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable String postId){
        System.out.println(postId);
        postService.deletePostByPostId(postId);
        return new ResponseEntity<>("delete successful", HttpStatus.OK);
    }

    public List<Searchbody> get_recommend_follow_list(String username){
        List<Searchbody> list = new ArrayList<>();

        //get the userlist that the user has followed
        User search_user = postService.getUserByUsername(username);
        List<String> followlist = search_user.getFollows();

        List<User> all_users = postService.getAllUsers();

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
                if (cur_user.getAvatar() != null) {
                    Media media = cur_user.getAvatar();
                    media.setData(mediaService.downloadFile(media.getFilename()));
                }
                Searchbody searchbody = new Searchbody(cur_user.getAvatar(),flag,cur_user.getUsername());
                list.add(searchbody);
            }


        }
        return list;
    }

    @GetMapping("/media/{filename}")
    public ResponseEntity<byte[]> getAvatarByFilename(@PathVariable String filename){
        System.out.println(filename);
        byte[] avatar = mediaService.downloadFile(filename);
        return new ResponseEntity<>(avatar, HttpStatus.OK);
    }

    @PostMapping("/media")
    public ResponseEntity<String> createMedia(@RequestParam("media") MultipartFile media) throws IOException {
        System.out.println("Create new Media");
        String filename = mediaService.saveFile(media);
        return new ResponseEntity<>(filename, HttpStatus.CREATED);
    }

    @GetMapping("/save/{username}")
    public ResponseEntity<List<Post>> getSavedPosts(@PathVariable String username) throws IOException{
        User user = postService.getUserByUsername(username);
        return new ResponseEntity<>(postService.savedPosts(user),HttpStatus.OK);
    }

    @PostMapping("/likes")
    public ResponseEntity<String> addLike(@RequestBody Map<String,Object> body){
        String username = body.get("username").toString();
        String post_id = body.get("post_id").toString();
        Boolean whether_like = Boolean.parseBoolean(body.get("like").toString());
        System.out.println(username+" "+post_id+" "+whether_like);
        User cur_user = postService.getUserByUsername(username);
        String user_id = cur_user.getId();
        String response;
        if(whether_like == true)
            response = postService.AddLike(user_id,post_id);
        else
            response = postService.DeleteLike(user_id,post_id);
        ResponseEntity response1 = new ResponseEntity<>(response,HttpStatus.OK);
        return response1;
    }

    @PostMapping("/resolution")
    public ResponseEntity<String> setImageResolution(@RequestBody Map<String, String> body){
        String resolution = body.get("resolution");
        mediaService.setResolution(resolution);
        postService.mediaService.setResolution(resolution);
        System.out.println("Resolution set to " + resolution);
        ResponseEntity response = new ResponseEntity<>("Success", HttpStatus.OK);
        return response;
    }
}
