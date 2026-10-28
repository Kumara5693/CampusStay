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

// Get bookings for owner's rooms
router.get("/owner-bookings", authMiddleware, async (req, res) => {
    try {
        // Import Room model if it's not imported at the top
        const Room = require("../models/Room");
        
        // 1. Find all rooms owned by the logged-in user
        const myRooms = await Room.find({ owner: req.user.id });
        const roomIds = myRooms.map(room => room._id);

        // 2. Find all bookings that match those room IDs
        const bookings = await Booking.find({ room: { $in: roomIds } })
            .populate("room", "title")
            .populate("user", "name email");

        res.json(bookings);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
module.exports = router;