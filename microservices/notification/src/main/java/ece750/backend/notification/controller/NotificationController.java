package ece750.backend.notification.controller;

import ece750.backend.notification.domain.Notification;
import ece750.backend.notification.service.NotificationService;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/notification")
public class NotificationController {
    @Resource
    private NotificationService notificationService;

    @GetMapping("/{username}")
    public ResponseEntity<Notification> getNotifications(@PathVariable String username) throws IOException {
        System.out.println(username);
        List<Notification> notifications = notificationService.getNotificationsByUsername(username);
        ResponseEntity response= new ResponseEntity<>(notifications, HttpStatus.OK);
        return response;
    }

    @PostMapping("/add/follow")
    public ResponseEntity<Notification> createNotification_follow(@RequestBody Map<String,String> user){
        System.out.println("follow request");
        String username_from = user.get("username_from");
        String username_to = user.get("username_to");
        Notification notification = notificationService.addNotification_follow(username_from,username_to);
        ResponseEntity response= new ResponseEntity<>(notification, HttpStatus.OK);
        return response;
    }

    @PostMapping("/add/comment")
    public ResponseEntity<Notification> createNotification_comment(@RequestBody Map<String,String> user){
        System.out.println("comment request");
        String username_from = user.get("username_from");
        String username_to = user.get("username_to");
        String id = user.get("postId");
        String comment = user.get("comment");
        Notification notification = notificationService.addNotification_comment(username_from,username_to,id,comment);
        ResponseEntity response= new ResponseEntity<>(notification, HttpStatus.OK);
        return response;
    }

    @PostMapping("/change")
    public ResponseEntity<String> ChangeStatus(@RequestBody Map<String,List<String>> user){
        System.out.println("change status request");
        List<String> id_list = user.get("notificationId");
        for(int index = 0;index<id_list.size();index++) {
            String id = id_list.get(index);
            notificationService.changeReadStatus(id);
        }
        ResponseEntity response= new ResponseEntity<>("success", HttpStatus.OK);
        return response;
    }
}
