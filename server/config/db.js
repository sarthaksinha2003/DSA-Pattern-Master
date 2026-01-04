const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/leetcode-tracker';

    const DB_NAME =
      process.env.MONGODB_DB_NAME || 'leetcode-tracker';

    // ✅ ACTUAL CONNECTION
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });

    console.log(
      `✅ MongoDB Connected → ${
        MONGO_URI.includes('mongodb+srv') ? 'Atlas' : 'Local'
      } | DB: ${DB_NAME}`
    );
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
