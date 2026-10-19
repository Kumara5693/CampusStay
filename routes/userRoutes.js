const express =require("express");
const User= require("../models/User");
const router = express.Router();
router.post("/register", async (req, res) => {
    try{
        const { name, email, password, role } = req.body;
        const newUser = new User({
            name,
            email,
            password,
            role
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    }
    catch (error){
        console.log(error);
        res.status(500).json({ message: "Error registering user", error });

    }
});
module.exports=router;