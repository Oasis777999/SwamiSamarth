const router = require("express").Router();
const User = require("../Models/User");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const upload = multer();

//Register Agent
router.post("/register", upload.none(), async (req, res) => {
  try {
    const {
      name,
      gender,
      address,
      district,
      state,
      pincode,
      dob,
      mobile,
      photo,
      kycDocument,
      password,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User is already registered, Check Mobile Number!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      gender,
      address,
      district,
      state,
      pincode,
      dob,
      mobile,
      photo,
      kycDocument,
      password: hashedPassword,
    });

    // Save to DB
    await newUser.save();

    // Remove password before sending response
    const { password: _, ...userData } = newUser.toObject();
    res
      .status(201)
      .json({ message: "User registred successfylly", data: userData });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const result = await User.findOne({ mobile });

    if (!result) {
      return res.status(404).json({ error: "User is not registered" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, result.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = JWT.sign(
      { userId: result._id, name: result.name },
      "Rushikesh", // Use env variable in production
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login success",
      token,
      user: {
        name: result.name,
        dob: result.dob,
        gender: result.gender,
        mobile: result.mobile,
        address: result.address,
        country: result.country,
        state: result.state,
        district: result.district,
        pincode: result.pincode,
        photo: result.photo,
        role: result.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Get Agent Data

router.get("/agent-data", async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Failed to get user." });
  }
});

// DELETE an agent by ID
router.delete("/agent-delete/:id", async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.status(200).json({ message: "Agent deleted successfully", result });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Update agent by ID
// Update user
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      name,
      mobile,
      dob,
      gender,
      address,
      state,
      district,
      pincode,
      photo,
      kycDocument,
      password, // optional
    } = req.body;

    console.log("One");
    

    const updateFields = {
      name,
      mobile,
      dob,
      gender,
      address,
      state,
      district,
      pincode,
    };

    console.log("Two");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Optional fields
    if (photo) updateFields.photo = photo;
    if (kycDocument) updateFields.kycDocument = kycDocument;
    if (password) updateFields.password = hashedPassword; // hash it in real apps

    console.log("Three");

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    console.log("Four");
    

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User updated successfully.", user: updatedUser });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Failed to update user." });
  }
});

module.exports = router;
