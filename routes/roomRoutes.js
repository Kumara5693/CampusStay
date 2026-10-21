const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const  protect  = require("../middleware/authMiddleware");
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

        if (room.owner.toString() !== req.user.id) {
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

        if (room.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this room" });
        }

        await room.deleteOne();
        res.json({ message: "Room deleted successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;