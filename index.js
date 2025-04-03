const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const hospitalAdminRoutes = require("./routes/hospitalAdminRoutes");
const systemAdminRoutes = require("./routes/systemAdminRoutes");
const receptionistRoutes = require("./routes/receptionistRoute");
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

app.use("/hospitalStaff", hospitalAdminRoutes);
app.use("/systemAdmin", systemAdminRoutes);
app.use("/reception", receptionistRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectDB();
});
