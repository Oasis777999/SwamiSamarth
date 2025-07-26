const mongoose = require("mongoose");
const createDefaultAdmin = require("./utils/seedAdmin");

const DB = process.env.DATABASE;

if (!DB) {
  console.error("❌ DATABASE environment variable not set.");
  process.exit(1);
}

mongoose.connect(DB)
  .then(() => {
    createDefaultAdmin();
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
