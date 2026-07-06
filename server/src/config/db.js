import mongoose from 'mongoose';

// Connects to MongoDB using the URI from our .env file.
// If the connection fails, we log the error and stop the server
// because there's no point running the API without a database.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
