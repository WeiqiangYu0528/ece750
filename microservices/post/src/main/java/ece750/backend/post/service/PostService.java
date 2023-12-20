package ece750.backend.post.service;

import ece750.backend.post.domain.*;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ExchangeStrategies;


import java.io.IOException;
import java.util.*;
@Service
public class PostService {
    @Autowired
    public MediaService mediaService;

    @Autowired
    private HashtagService hashtagService;

    @Resource
    private MongoTemplate mongoTemplate;

    private static final String COLLECTION_NAME = "post";

    private final WebClient webClient;

    public PostService(@Value("${serviceHost}") String serviceHost,
                       @Value("${servicePort}") String servicePort,
                       @Value("${serviceUri}") String serviceUri,
                       WebClient.Builder webClientBuilder) {
        final int size = Integer.MAX_VALUE;
        final String url = "http://" + serviceHost + ":" + servicePort + "/" + serviceUri;
        System.out.println(url);
        final ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();
        this.webClient = webClientBuilder.baseUrl(url)
                .exchangeStrategies(strategies)
                .build();
    }

    public Post FindPostById(String id) {
        Criteria criteria = Criteria.where("id").is(id);
        Query query = new Query(criteria);
        Post post = mongoTemplate.findOne(query, Post.class, COLLECTION_NAME);
        return post;
    }

//    public Post FindPostByOid(ObjectId id) {
//        Criteria criteria = Criteria.where("_id").is(id);
//        Query query = new Query(criteria);
//        Post post = mongoTemplate.findOne(query, Post.class, COLLECTION_NAME);
//        return post;
//    }

    public List<Post> allPosts(){
        return mongoTemplate.findAll(Post.class,"post");
    }

    public List<Post> getPostsByUser(String username, Media avatar, int loadingNumber){
        Query query = new Query(Criteria.where("username").is(username))
                .with(Sort.by(Sort.Order.desc("time_created")));

        query.limit(loadingNumber);
        List<Post> posts = mongoTemplate.find(query, Post.class);
        for (Post post: posts){
            post.setAvatar(avatar);
            updatePostMedia(post);
        }
        return posts;
    }

    public Comment updateCommentByComment(User user, String comment, String commentId){
        Comment newComment = new Comment(user.getUsername(),comment);
        mongoTemplate.insert(newComment,"comment");
        mongoTemplate.update(Comment.class).matching(Criteria.where("_id").is(commentId))
                .apply(new Update().push("replies").value(newComment.getId()))
                .first();
        return newComment;
    }

    public Comment updatePostByComment(User user, String comment, String postId){
        Comment newComment = new Comment(user.getUsername(),comment);
        mongoTemplate.insert(newComment,"comment");
        mongoTemplate.update(Post.class).matching(Criteria.where("_id").is(postId))
                .apply(new Update().push("comments").value(newComment.getId()))
                .first();
        return newComment;
    }

    public void deleteComment(Comment comment){
        if(comment.getReplies() != null){
            for(Comment reply: comment.getReplies()){
                deleteComment(reply);
            }
        }
        String id = comment.getId();
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        mongoTemplate.remove(query,Comment.class,"comment");
    }

    public Post newPost(User user, String caption, MultipartFile[] media, String hashtags) throws IOException {
        List<Media> mediaList = mediaService.createMediaList(media);
        Post post = new Post(user.getUsername(),caption,mediaList);
        if(!hashtags.equals("")){
            hashtagService.addHashtags(hashtags, post);
        }
        mongoTemplate.insertAll(mediaList);
        mongoTemplate.insert(post,"post");
        //change the logic to id afterwards. Currently use username.
        mongoTemplate.update(User.class).matching(Criteria.where("username").is(user.getUsername()))
                .apply(new Update().push("postIds").value(post.getId()))
                .first();
        return post;
    }

    public List<Post> savedPosts(User user) throws IOException{
        List<Post> posts = new ArrayList<>();
        if(user.getSaved_posts() != null){
            for(String id: user.getSaved_posts()){
                Post post = FindPostById(id);
                Media avatar = getAvatarMedia(post.getUsername());
                if (avatar != null) {
                    avatar.setData(mediaService.downloadFile(avatar.getFilename()));
                }
                post.setAvatar(avatar);
                updatePostMedia(post);
                posts.add(post);
            }
        }
        return posts;
    }

    public String AddLike(String user_id, String post_id) {
        //User targetUser = userService.FindUserByUserId(user_object_id);
        //Post targetPost = FindPostById(post_id);

        //Add user_id into post's likes list
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(post_id));

        Update update1 = new Update();
        update1.addToSet("likes",user_id);

        mongoTemplate.updateFirst(query, update1, Post.class);

        //Add post_id into curr_user's post_like list
        Query query1 = new Query();
        query1.addCriteria(Criteria.where("id").is(user_id));

        Update update2 = new Update();
        update2.addToSet("like_posts",post_id);

        mongoTemplate.updateFirst(query1, update2, User.class);

        return "successful";
    }

    public String DeleteLike(String user_id, String post_id) {
        User targetUser = getUserByUserId(user_id);
        Post targetPost = FindPostById(post_id);

        //Delete user_id into post's likes list
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(post_id));

        Update update1 = new Update();
        update1.pull("likes",user_id);

        mongoTemplate.updateFirst(query, update1, Post.class);

        //Delete post_id into curr_user's like_post list
        Query query1 = new Query();
        query1.addCriteria(Criteria.where("id").is(user_id));

        Update update2 = new Update();
        update2.pull("like_posts",post_id);

        mongoTemplate.updateFirst(query1, update2, User.class);

        return "successful";
    }

    public List<Post> getPostsByHashtag(String hashtag){
        Hashtag tag = hashtagService.getHashtag(hashtag);
        for(Post post: tag.getPostList()){
            Media avatar = getAvatarMedia(post.getUsername());
            if (avatar != null) {
                avatar.setData(mediaService.downloadFile(avatar.getFilename()));
            }
            post.setAvatar(avatar);
            updatePostMedia(post);
        }
        System.out.println(tag.getTag());
        return tag.getPostList();
    }

    public void deletePostByPostId(String id){
        Post post = FindPostById(id);
//        System.out.println(post);
        if(post != null){
            if(post.getMediaList() != null){
                for(Media media: post.getMediaList()){
                    mediaService.deleteFile(media);
                }
            }
            if(post.getComments() != null){
                for(Comment comment: post.getComments()){
                    deleteComment(comment);
                }
            }
            if(post.getHashtags() != null){
                for(String tag: post.getHashtags()){
                    tag = tag.substring(1);
                    mongoTemplate.update(Hashtag.class).matching(Criteria.where("tag").is(tag))
                            .apply(new Update().pull("postList",id)).first();
                }
            }
            mongoTemplate.update(User.class).matching(Criteria.where("username").is(post.getUsername()))
                    .apply(new Update().pull("postIds",id)).first();
            mongoTemplate.remove(post);
        }
    }


    public void updatePostMedia(Post post){
        if(post.getMediaList() != null){
            for(Media media: post.getMediaList()){
                media.setData(mediaService.downloadFile(media.getFilename()));
            }
        }
        if(post.getComments() != null){
            for(Comment comment: post.getComments()){
                updateCommentMedia(comment);
            }
        }
    }

    public void updateCommentMedia(Comment comment){
        Media avatar = getAvatarMedia(comment.getUsername());
        if (avatar != null) {
            avatar.setData(mediaService.downloadFile(avatar.getFilename()));
        }
        comment.setAvatar(avatar);
        if(comment.getReplies() != null){
            for(Comment reply: comment.getReplies()){
                Media replyAvatar = getAvatarMedia(reply.getUsername());
                if (replyAvatar != null) {
                    replyAvatar.setData(mediaService.downloadFile(replyAvatar.getFilename()));
                }
                reply.setAvatar(replyAvatar);
            }
        }
    }

    public Media getAvatarMedia(String username) {
        return this.webClient.get()
                .uri("/avatar/{username}", username)
                .retrieve()
                .bodyToMono(Media.class) // Assuming the response is in byte array format
                .block(); // Blocking for simplicity; use subscribe() in non-blocking scenarios
    }

    public User getUserByUsername(String username) {
        return this.webClient.get()
                .uri("/u/{username}", username)
                .retrieve()
                .bodyToMono(User.class) // Assuming the response is in byte array format
                .block(); // Blocking for simplicity; use subscribe() in non-blocking scenarios
    }

    public User getUserByUserId(String id) {
        return this.webClient.get()
                .uri("/uid/{id}", id)
                .retrieve()
                .bodyToMono(User.class) // Assuming the response is in byte array format
                .block(); // Blocking for simplicity; use subscribe() in non-blocking scenarios
    }

    public List<User> getAllUsers() {
        return this.webClient.get()
                .uri("/all")
                .retrieve()
                .bodyToFlux(User.class)  // Assuming the response is a list of posts
                .collectList()
                .block(); // Blocking for simplicity; use subscribe() in non-blocking scenarios
    }
}



