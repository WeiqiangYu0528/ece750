package ece750.backend.post.service;

import ece750.backend.post.domain.*;
import jakarta.annotation.Resource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class HashtagService {

    @Resource
    private MongoTemplate mongoTemplate;

    public void addHashtags(String hashtags, Post post) throws IOException {
        String[] tags = hashtags.split(",");
        post.setHashtags(tags);
        for(String tag: tags){
            //if tag in the database
            String hashtag = tag.substring(1);
            if(getHashtag(hashtag) != null){
                System.out.println("exists");
                mongoTemplate.update(Hashtag.class).matching(Criteria.where("tag").is(hashtag))
                        .apply(new Update().push("postList").value(post))
                        .first();
            }else{
                //tag not in the database
                Hashtag newHashtag = new Hashtag(hashtag, post);
                mongoTemplate.insert(newHashtag,"hashtag");
            }
        }
    }

    public Hashtag getHashtag(String hashtag) {
        Criteria criteria = Criteria.where("tag").is(hashtag);
        Query query = new Query(criteria);
        return mongoTemplate.findOne(query, Hashtag.class, "hashtag");
    }

}