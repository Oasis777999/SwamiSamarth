const express = require("express");
const cors = require("cors");
const PersonData = require("./Models/PersonMode.js");
const User = require("./Models/User.js");
const multer = require("multer");
const bcrypt = require("bcryptjs");


require('dotenv').config();
require("./connect.js");

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: true }));

//Register Agent
app.post("/register", upload.none(), async (req, res) => {
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
      return res.status(400).json({ error: "User is already registered" });
    }

        console.log(password);
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword, password);
    

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
    res.status(201).json({ data: userData });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

//login
const JWT = require("jsonwebtoken");

app.post("/login", async (req, res) => {
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
        gender:result.gender,
        mobile: result.mobile,
        address: result.address,
        country: result.country,
        state: result.state,
        district: result.district,
        pincode: result.pincode,
        photo: result.photo,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Upload Volontiers

app.post("/upload", upload.none(), async (req, res) => {
  try {
    const {
      name,
      dob,
      gender,
      address,
      district,
      state,
      pincode,
      mobile,
      photo,
      kycDocument,
    } = req.body;

    const data = new PersonData({
      name,
      dob,
      gender,
      address,
      district,
      state,
      pincode,
      mobile,
      photo,
      kycDocument,
    });

    console.log(data);

    await data.save();
    res.status(200).json({ message: "Data saved with images", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to save data", details: error.message });
  }
});

// Upload Bulk Volontiers
app.post("/bulk-upload", async (req, res) => {
  try {
    const result = await PersonData.insertMany(req.body);
    res.status(201).json({ message: "Agents inserted", count: result.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert agents" });
  }
});

// Get Volontiers Data

app.get("/data", async (req, res) => {
  try {
    const data = await PersonData.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get Agent Data

app.get("/agent-data", async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// DELETE an agent by ID
app.delete("/agent-delete/:id", async (req, res) => {
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
app.put("/agent-update/:id", async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.status(200).json({ message: "Agent updated successfully", result });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


