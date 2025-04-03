const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const hospitalAdminRoutes = require('./routes/hospitalAdminRoutes')
const hospotalAdminRoutes = require('./routes/hospitalAdminRoutes')
const connectDB = require('./lib/db')


dotenv.config();
const port = process.env.PORT

const app = express();
app.use(express.json())
app.use(cors({
    credentials:true,
    origin: "http://localhost:5173/"
}))



app.use("/hospitalStaff",hospitalAdminRoutes)


app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
    connectDB();
})