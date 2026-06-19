import dotenv from 'dotenv';
// Load environment variables immediately on import to ensure availability
dotenv.config();

import mongoose from 'mongoose';

/**
 * Extracts and returns the safe host names from a MongoDB connection string.
 * It removes the username, password, and query parameters to avoid logging credentials.
 */
const getSafeUriHost = (uri) => {
  if (!uri) return '';
  try {
    // If credentials are present (indicated by @), extract the host portion following @
    if (uri.includes('@')) {
      const match = uri.match(/@([^/?]+)/);
      return match ? match[1] : uri;
    }
    // Otherwise, strip the scheme and return the host portion
    const match = uri.match(/^(?:mongodb(?:\+srv)?:\/\/)([^/?]+)/);
    return match ? match[1] : uri;
  } catch (e) {
    return 'unknown-host';
  }
};

/**
 * Validates that the URI starts with a valid MongoDB protocol.
 */
const validateUri = (uri) => {
  if (!uri) return false;
  return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
};

export const connectDB = async () => {
  // Disable mongoose buffering to prevent queries from hanging when db is not connected
  mongoose.set("bufferCommands", false);

  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = process.env.MONGO_URI_DIRECT;

  if (!primaryUri) {
    console.error("MONGO_URI environment variable is missing.");
    process.exit(1);
  }

  if (!validateUri(primaryUri)) {
    console.error(`Invalid MONGO_URI format. URI must start with 'mongodb://' or 'mongodb+srv://'. Received: ${primaryUri}`);
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  };

  const safePrimaryHost = getSafeUriHost(primaryUri);
  console.log(`Connecting to MongoDB (Primary)... Host: ${safePrimaryHost}`);

  try {
    const conn = await mongoose.connect(primaryUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const isSrvError = primaryUri.startsWith('mongodb+srv://') && (
      error.message.includes('querySrv ECONNREFUSED') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('querySrv')
    );

    if (isSrvError && fallbackUri) {
      console.warn(`\n[MongoDB Connection Warning] Primary SRV connection failed: ${error.message}`);
      console.warn("Attempting fallback connection using MONGO_URI_DIRECT...");

      if (!validateUri(fallbackUri)) {
        console.error(`Invalid MONGO_URI_DIRECT format. URI must start with 'mongodb://' or 'mongodb+srv://'. Received: ${fallbackUri}`);
        process.exit(1);
      }

      const safeFallbackHost = getSafeUriHost(fallbackUri);
      console.log(`Connecting to MongoDB (Fallback)... Host: ${safeFallbackHost}`);

      try {
        const conn = await mongoose.connect(fallbackUri, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.error("MongoDB fallback connection failed:", fallbackError.message);
        process.exit(1);
      }
    } else {
      // Categorize and print nice user-friendly error messages
      const msg = error.message || '';
      if (msg.includes("bad auth") || msg.includes("Authentication failed") || error.code === 8000) {
        console.error("\n[MongoDB Connection Error] Authentication failed. Please check if database username and password in .env are correct.");
      } else if (msg.includes("connection timed out") || msg.includes("Could not connect to any servers") || error.name === "MongooseServerSelectionError") {
        console.error("\n[MongoDB Connection Error] Server selection timed out. This usually indicates an IP Whitelist issue in MongoDB Atlas or a network blocking connection.");
      } else if (msg.includes("scheme") || msg.includes("must start with") || msg.includes("invalid connection string")) {
        console.error("\n[MongoDB Connection Error] Invalid connection string format. Please verify MONGO_URI in .env starts with 'mongodb://' or 'mongodb+srv://'.");
      }
      
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    }
  }
};

export default connectDB;
