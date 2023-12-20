package ece750.backend.notification.service;

import ece750.backend.notification.domain.Notification;

import jakarta.annotation.Resource;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    @Resource
    private MongoTemplate mongoTemplate;

    private static final String COLLECTION_NAME = "notification";

    public List<Notification> getNotificationsByUsername(String username){
        List<Notification> notifications = new ArrayList<Notification>();
        Criteria criteria = Criteria.where("username_to").is(username);
        Query query = new Query(criteria);
        query.with(Sort.by(Sort.Order.desc("time_created")));
        notifications.addAll(mongoTemplate.find(query, Notification.class, COLLECTION_NAME));
        return notifications;
    }

    public Notification addNotification_comment(String username_from,String username_to,String postId,String comment){
        Notification new_notification = new Notification(username_from,username_to,"comment",postId,comment);
        return mongoTemplate.insert(new_notification, COLLECTION_NAME);
    }

    public Notification addNotification_follow(String username_from,String username_to){
        Notification new_notification = new Notification(username_from,username_to,"follow",null,null);
        //new_notification.setUsername_from(username_from);
        return mongoTemplate.insert(new_notification, COLLECTION_NAME);
    }

    public String changeReadStatus(String id){
        Update update = new Update();
        update.set("whether_read",true);
        Criteria criteria = Criteria.where("idString").is(id);
        Query query = new Query(criteria);
        mongoTemplate.updateFirst(query,update,Notification.class);
        return "change status success";
    }

    public String deleteNotification(String id){
        Criteria criteria = Criteria.where("_id").is(id);
        Query query = new Query(criteria);
        mongoTemplate.remove(criteria,COLLECTION_NAME);
        return "Delete success";
    }
}
