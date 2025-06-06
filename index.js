const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");
const hospitalAdminRoutes = require("./routes/hospitalAdminRoutes");
const triageRoutes = require("./routes/triageRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const labRoutes = require("./routes/labReqeustRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const systemAdminRoutes = require("./routes/systemAdminRoutes");
const receptionistRoutes = require("./routes/receptionistRoute");

const authRoute = require("./routes/authRoute");
dotenv.config();

const connectDB = require("./lib/db");

const port = process.env.PORT;


const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());

app.use("/hospitalAdmin", hospitalAdminRoutes);
app.use("/systemAdmin", systemAdminRoutes);
app.use("/reception", receptionistRoutes);
app.use("/triage", triageRoutes);
app.use("/doctor", doctorRoutes);
app.use("/lab", labRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/auth", authRoute);

app.get('/', (req,res)=>{
  res.json({msg:"welcome to medico-net"})
})


// temporary admin

app.post("/admin-reg", async (req, res) => {
  try {
    const userData = req.body;
    // console.log(userData.password);
    const salt = await bcrypt.genSalt(10);

    userData.password = await bcrypt.hash(userData.password, salt);

    const user = new Admin(userData);

    user.save();

    res.status(200).json({ msg: "you are now an admin" });
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectDB();
});

