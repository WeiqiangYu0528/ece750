// mongo-init.js

// Connect to the admin database
var adminDB = db.getSiblingDB('admin');

// Authenticate as the root user
adminDB.auth('admin', 'ece750');

// Switch to the desired database (e.g., "instagram")
var instagramDB = db.getSiblingDB('instagram');

// Perform operations in the "instagram" database
instagramDB.createUser({
  user: 'admin',
  pwd: 'ece750',
  roles: ['readWrite']
});

// ... other initialization operations in the "instagram" database
