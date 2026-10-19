const express =require("express");
const User= require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        
        const token = jwt.sign({ id: user._id }, "CampusStaySecretKey", { expiresIn: "1h" });

        
        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error during login", error });
    }
});

module.exports=router;