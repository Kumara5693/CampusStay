const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/authMiddleware"); 

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

        const status = role === "Owner" ? "Pending" : "Approved";

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone: role === "Owner" ? phone : null,
            status
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

        if (user.role === "Owner" && user.status === "Pending") {
            return res.status(403).json({ message: "Your account is pending Admin approval." });
        }

        const token = jwt.sign({ id: user._id }, "CampusStaySecretKey", { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error during login", error });
    }
});

// Admin Route 1: Get all users
router.get("/all-users", protect, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (currentUser.role !== "Admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const users = await User.find({ role: { $ne: "Admin" } }).select("-password");
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Admin Route 2: Approve an owner
router.put("/approve-owner/:id", protect, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (currentUser.role !== "Admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const owner = await User.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true });
        if (!owner) return res.status(404).json({ message: "Owner not found" });

        res.json({ message: "Owner approved successfully", owner });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Admin Route 3: Delete (Remove) any user
router.delete("/:id", protect, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (currentUser.role !== "Admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        await userToDelete.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;