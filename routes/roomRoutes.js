const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const User = require("../models/User"); 
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); 

router.post("/", protect, upload.array("images", 5), async (req, res) => {
    try {
        const { title, description, price, location, facilities } = req.body;
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const room = new Room({
            owner: req.user.id, 
            title,
            description,
            price,
            location,
            facilities: facilities ? facilities.split(",") : [], 
            images: imageUrls 
        });

        await room.save();
        res.status(201).json({ message: "Room added successfully!", room });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/owner-rooms", protect, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        let rooms;

        if (currentUser && currentUser.role === "Admin") {
            rooms = await Room.find({}); 
        } else {
            rooms = await Room.find({ owner: req.user.id }); 
        }
        
        res.json(rooms);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const { location, maxPrice } = req.query;
        let query = {}; 
        
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }
        
        if (maxPrice) {
            query.price = { $lte: Number(maxPrice) };
        }

        const rooms = await Room.find(query).populate("owner", "name email phone");
        res.json(rooms);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        let room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found" });

        const currentUser = await User.findById(req.user.id);

        if (room.owner.toString() !== req.user.id && (!currentUser || currentUser.role !== "Admin")) {
            return res.status(403).json({ message: "Not authorized to update this room" });
        }

        room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Room updated successfully!", room });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found" });

        const currentUser = await User.findById(req.user.id);

        if (room.owner.toString() !== req.user.id && (!currentUser || currentUser.role !== "Admin")) {
            return res.status(403).json({ message: "Not authorized to delete this room" });
        }

        await room.deleteOne();
        res.json({ message: "Room deleted successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Temporary route to make kumara@gmail.com a Super Admin
router.get("/make-admin", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ email: "kumara@gmail.com" }, { role: "Admin" }, { new: true });
        if(user) {
            res.send("Success! kumara@gmail.com is now an Admin.");
        } else {
            res.send("User kumara@gmail.com not found. Please register this email first.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error making admin");
    }
});

module.exports = router;