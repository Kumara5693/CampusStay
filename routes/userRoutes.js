const express =require("express");
const User= require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (role === "Owner" && !phone) {
            return res.status(400).json({ message: "Phone number is required for boarding owners" });
        }
        if (!["Student", "Owner", "Admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone: role === "Owner" ? phone : null
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
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