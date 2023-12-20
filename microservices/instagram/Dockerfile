FROM node:21-alpine

WORKDIR /app

COPY build/ build/

RUN npm install -g serve
  
EXPOSE 3000

CMD ["serve", "-s", "build"]