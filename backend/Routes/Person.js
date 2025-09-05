const router = require("express").Router();
const PersonData = require("../Models/PersonMode");
const ExcelJS = require("exceljs");
const multer = require("multer");
const upload = multer();

// Upload Volontiers

router.post("/upload", upload.none(), async (req, res) => {
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

    await data.save();
    res.status(200).json({ message: "Data saved with images", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to save data", details: error.message });
  }
});

// Upload Bulk Volontiers
router.post("/bulk-upload", async (req, res) => {
  try {
    const result = await PersonData.insertMany(req.body);
    res.status(201).json({ message: "Agents inserted", count: result.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert agents" });
  }
});

// Get Volontiers Data
router.get("/data", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // set limit (e.g. 50)
    const search = req.query.search ? req.query.search.trim() : "";
    const state = req.query.state || "";
    const district = req.query.district || "";

    const query = {};

    if (state) query.state = state;
    if (district) query.district = district;

    if (search) {
      const searchIsNumber = /^\d+$/.test(search);
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        // add more searchable fields if needed
      ];
      if (searchIsNumber) {
        query.$or.push({ mobile: Number(search) });
      }
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PersonData.find(query).skip(skip).limit(limit),
      PersonData.countDocuments(query),
    ]);

    res.status(200).json({ data, total });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Export all filtered data as Excel// 2. Export all filtered data as Excel
router.get("/export", async (req, res) => {
  try {
    const { search = "", state = "", district = "" } = req.query;

    const filter = {};
    if (state) filter.state = state;
    if (district) filter.district = district;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$mobile" },
              regex: search,
              options: "i",
            },
          },
        },
      ];
    }

    const data = await PersonData.find(filter);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Filtered Data");

    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Date of Birth", key: "dob", width: 15 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Address", key: "address", width: 30 },
      { header: "Country", key: "country", width: 15 },
      { header: "State", key: "state", width: 15 },
      { header: "District", key: "district", width: 15 },
      { header: "Pincode", key: "pincode", width: 10 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        name: item.name,
        gender: item.gender,
        dob: item.dob ? new Date(item.dob).toLocaleDateString("en-GB") : "N/A",
        mobile: item.mobile,
        address: item.address,
        country: item.country,
        state: item.state,
        district: item.district,
        pincode: item.pincode,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="filtered-data.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Failed to export data" });
  }
});

router.get("/report", async (req, res) => {
  try {
    const data = await PersonData.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
module.exports = router;
