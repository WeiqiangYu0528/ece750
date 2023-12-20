FROM mongo:latest

COPY entrypoint.sh /usr/local/bin/
COPY init-mongo.js /docker-entrypoint-initdb.d/

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
