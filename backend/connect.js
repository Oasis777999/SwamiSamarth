const mongoose = require("mongoose");

const DB = process.env.DATABASE;

if (!DB) {
  console.error("❌ DATABASE environment variable not set.");
  process.exit(1);
}

mongoose.connect(DB)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
