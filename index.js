const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send("Server is working");
});

app.listen(PORT,()=>{
    console.log(`port is: ${PORT}`);
});