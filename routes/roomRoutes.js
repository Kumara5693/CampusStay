const express =require("express");
const router= express.Router();
const Room=require("../models/Room");
const authMiddleware = require("../middleware/authMiddleware"); 
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { title, description, price, location } = req.body;

        const newRoom = new Room({
            title,
            description,
            price,
            location,
            owner: req.user.id 
        });
        const savedRoom = await newRoom.save();
        res.status(201).json({ message: "Room added successfully!", room: savedRoom });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding room", error });
    }
});
router.get("/all", async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    }
     catch (error) 
     {
        console.log(error);
        res.status(500).json({ message: "Error Fetching Rooms", error });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        
        if (!room)
             {
            return res.status(404).json({ message:"Room not Found!"});
        }
        
        res.status(200).json(room);
        
    } catch (error) 
    {
        console.log(error);
        res.status(500).json({ message:"Error fetching the Room", error });
    }
});
router.put("/update/:id", authMiddleware, async (req, res) => {
    try {
        let room = await Room.findById(req.params.id);
        if (!room)
             {
            return res.status(404).json({ message: "Room not found!" });
        }

        if (room.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to update this room!" });
        }

        room = await Room.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.status(200).json({ message: "Room updated successfully", room });

    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating room", error });
    }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found!" });
        }

        if (room.owner.toString() !== req.user.id) 
            {
            return res.status(401).json({ message:"Not authorized to delete this room!" });
        }

        await room.deleteOne();
        res.status(200).json({ message:"Room deleted successfully" });

    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting room", error });
    }
});
module.exports = router;