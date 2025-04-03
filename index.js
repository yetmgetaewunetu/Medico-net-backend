const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const hospotalAdminRoutes = require('./routes/hospitalAdminRoutes')
dotenv.config();

const app = express();
app.use(express.json())
const port = process.env.PORT


app.use(cors({
    credentials:true,
    origin: "http://localhost:5173/"
}))


app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
})