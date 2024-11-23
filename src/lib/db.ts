import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface GlobalMongo {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global type
declare global {
  var mongoose: GlobalMongo;
}

// Initialize the global mongoose object if it doesn't exist
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null } as GlobalMongo;
}

const opts = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

let cached = global.mongoose;

export async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    // If we have a connection, return it
    if (cached.conn) {
      return cached.conn;
    }

    // If we're already connecting, wait for the connection
    if (cached.promise) {
      return await cached.promise;
    }

    // Start a new connection
    cached.promise = mongoose.connect(MONGODB_URI!, opts);

    try {
      cached.conn = await cached.promise;
      console.log('MongoDB connected successfully');
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      throw error;
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  cached.conn = null;
  cached.promise = null;
});

// Gracefully close the connection when the app terminates
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});
