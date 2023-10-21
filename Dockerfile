FROM alpine:latest

RUN apk update && \
    apk add bash && \
    apk add curl && \
    apk add openjdk11

RUN mkdir /app && \
    mkdir /app/scripts/ && \
    mkdir /app/apache-jmeter-5.6.2/

COPY acmeair-driver/acmeair-jmeter/scripts /app/scripts/
COPY apache-jmeter-5.6.2 /app/apache-jmeter-5.6.2/
COPY jmeter.sh /app/

RUN chgrp -R 0 /app && \
    chmod -R g=u /app

WORKDIR /app

CMD ["./jmeter.sh"]
