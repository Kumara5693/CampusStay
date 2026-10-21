const mongoose= require("mongoose");

const bookingSchema =new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default:"Pending" 
    }
}, 
{ timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);