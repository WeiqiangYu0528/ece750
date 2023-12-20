#!/bin/bash

# Execute the MongoDB initialization script using mongosh
mongosh --host localhost:27017 /docker-entrypoint-initdb.d/init-mongo.js

# Start MongoDB
exec docker-entrypoint.sh mongod
