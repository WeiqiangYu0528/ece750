package ece750.backend.authentication.service;

import ece750.backend.authentication.domain.User;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {
    @Resource
    private MongoTemplate mongoTemplate;

    private final WebClient webClient;

    private static final String COLLECTION_NAME = "user";

    public AuthServiceImpl(@Value("${serviceHost}") String serviceHost,
                           @Value("${servicePort}") String servicePort,
                           @Value("${serviceUri}") String serviceUri,
                           WebClient.Builder webClientBuilder) {
        final int size = Integer.MAX_VALUE;
        final String url = "http://" + serviceHost + ":" + servicePort + "/" + serviceUri;
        final ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();
        this.webClient = webClientBuilder.baseUrl(url)
                .exchangeStrategies(strategies)
                .build();
    }

    @Override
    public User AddUser(User user) {
        User newUser = mongoTemplate.insert(user, COLLECTION_NAME);
        return newUser;
    }

    @Override
    public User FindUserByUsername(String username) {
        Criteria criteria = Criteria.where("username").is(username);
        Query query = new Query(criteria);
        User user = mongoTemplate.findOne(query, User.class, COLLECTION_NAME);
        return user;
    }

    @Override
    public List<User> FindUserByEmail(String email) {
        Criteria criteria = Criteria.where("email").is(email);
        Query query = new Query(criteria);
        List<User> documentList = mongoTemplate.find(query, User.class, COLLECTION_NAME);
        return documentList;
    }

    @Override
    public byte[] getUserAvatar(String filename) {
        return this.webClient.get()
                .uri("/media/{filename}", filename)
                .retrieve()
                .bodyToMono(byte[].class) // Assuming the response is in byte array format
                .block(); // Blocking for simplicity; use subscribe() in non-blocking scenarios
    }
}
