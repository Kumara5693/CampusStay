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


router.get("/my-bookings", authMiddleware, async (req, res) => {
    try {
       
        const bookings = await Booking.find({ user: req.user.id }).populate("room");
        
        res.status(200).json(bookings);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message:"Error Fetching bookings", error });
    }
});

router.delete("/cancel/:id", authMiddleware, async (req, res) => {
    try {
        const booking= await Booking.findById(req.params.id);
        if (!booking) 
            {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to cancel this booking" });
        }

        await booking.deleteOne();
        res.status(200).json({ message: "Booking cancelled successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error cancelling booking", error });
    }
});
module.exports = router;