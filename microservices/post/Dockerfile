FROM openjdk:22-oracle

EXPOSE 8080

RUN mkdir /app

ADD target/ece750.backend.post.jar /app/ece750.backend.post.jar

RUN chgrp -R 0 /app && \
    chmod -R g=u /app

WORKDIR /app

ENTRYPOINT ["java","-jar","ece750.backend.post.jar"]
