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
module.exports = router;