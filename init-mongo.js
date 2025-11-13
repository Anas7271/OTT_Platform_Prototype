// MongoDB initialization script for OTT Platform
// This script creates the database and initial collections

// Switch to the ott-platform database
db = db.getSiblingDB('ott-platform');

// Create collections with indexes for better performance
db.createCollection('users');
db.createCollection('content');

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ subscriptionPlan: 1 });
db.users.createIndex({ createdAt: 1 });

// Create indexes for content collection
db.content.createIndex({ uploadedBy: 1 });
db.content.createIndex({ category: 1 });
db.content.createIndex({ accessLevel: 1 });
db.content.createIndex({ title: "text", description: "text" }); // Text search index
db.content.createIndex({ createdAt: -1 });
db.content.createIndex({ uploadTime: -1 });

// Create a default admin user (you can remove this in production)
print('Database "ott-platform" initialized successfully');
print('Collections and indexes created');
print('Note: Default admin credentials are NOT created here for security reasons');