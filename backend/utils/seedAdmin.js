const bcrypt = require("bcryptjs");
const User = require("../Models/User");

const createDefaultAdmin = async () => {
  try {
    const adminMobile = 9999999999;
    const existingAdmin = await User.findOne({ mobile: adminMobile });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin@123", 10);

      const admin = new User({
        name: "Super Admin",
        gender: "male",
        dob: new Date("1980-01-01"),
        mobile: adminMobile,
        password: hashedPassword,
        address: "HQ, Pune",
        state: "Maharashtra",
        district: "Pune",
        pincode: 411001,
        photo: "admin_photo_base64_or_url",     // dummy base64 or skip validation if needed
        kycDocument: "admin_kyc_base64_or_url",
        isAdmin: true,
      });
      
      await admin.save();
      console.log("✅ Default admin created.");
    } else {
      console.log("ℹ️ Admin already exists.");
    }
  } catch (err) {
    console.error("❌ Failed to create admin:", err.message);
  }
};

module.exports = createDefaultAdmin;
