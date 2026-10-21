const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;

        const newBooking = new Booking(
            {
            user: req.user.id,     
            room: room,            
            checkInDate: checkInDate,
            checkOutDate: checkOutDate
        });

        const savedBooking = await newBooking.save();
        res.status(201).json({ message:"Booking successful!", booking: savedBooking });

    } catch (error) 
    {
        console.log(error);
        res.status(500).json({ message:"Error creating booking", error });
    }
});

module.exports = router;