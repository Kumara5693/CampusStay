const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const userRoutes= require("./routes/userRoutes");
app.use("/api/users",userRoutes);

const URL = process.env.MONGO_URI;
mongoose.connect(URL)
 .then(() => {
    console.log("MongoDB is Connected");
 })
 .catch((error) => {
   console.log("Error!", error);
 });

app.get('/', (req,res) => {
    res.send("Server is working");
});

app.listen(PORT,()=>{
    console.log(`port is: ${PORT}`);
});