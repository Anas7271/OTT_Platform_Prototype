import { MongoClient, Db, Collection } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
    _mongoosePromise?: Promise<typeof mongoose>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }

  if (!globalWithMongo._mongoosePromise) {
    globalWithMongo._mongoosePromise = mongoose.connect(uri);
  }

  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  mongoose.connect(uri);
}

export default clientPromise;

// Mongoose connection function
export async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
  return mongoose;
}

// Database helper functions
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('ott-platform');
}

export async function getUsersCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('users');
}

export async function getContentCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('content');
}