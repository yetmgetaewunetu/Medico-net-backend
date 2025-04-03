const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const hospitalAdminRoutes = require("./routes/hospitalAdminRoutes");
const triageRoutes = require("./routes/triageRoutes");
const labRoutes = require("./routes/labReqeustRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const systemAdminRoutes = require("./routes/systemAdminRoutes");
const receptionistRoutes = require("./routes/receptionistRoute");

const authRoute = require("./routes/authRoute");

const connectDB = require("./lib/db");

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173/",
    
  })
);
app.use(cookieParser());

app.use("/hospitalStaff", hospitalAdminRoutes);
app.use("/systemAdmin", systemAdminRoutes);
app.use("/reception", receptionistRoutes);
app.use("/triage", triageRoutes);
app.use("/lab", labRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectDB();
});

// temporary admin

// const Admin = require("./models/Admin");
// const bcrypt = require("bcrypt");
// app.post("/admin-reg", async (req, res) => {
//   try {
//     const userData = req.body;
//     // console.log(userData.password);
//     const salt = await bcrypt.genSalt(10);

//     userData.password = await bcrypt.hash(userData.password, salt);

//     const user = new Admin(userData);

//     user.save();

//     res.status(200).json({ msg: "you are now an admin" });
//   } catch (error) {
//     console.log(error);
//   }
// });
