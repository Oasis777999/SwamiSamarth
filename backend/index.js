const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const {checkAndSendBirthdaySMS} = require("./utils/birthdayService.js");
const PORT = 5000;

require('dotenv').config();
require("./connect.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: true }));

//Send SMS using api
cron.schedule('00 12 * * *', ()=>{
  checkAndSendBirthdaySMS();
})


//Testing API
app.get("/", (rea, res)=>{
  res.send("Application is live");
})

const personRoute = require("./Routes/Person.js");
const userRoute = require("./Routes/User.js");


app.use("/person", personRoute);
app.use("/user", userRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


