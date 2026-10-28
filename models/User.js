const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["Student", "Owner", "Admin"], 
        required: true
    },
    phone: {
        type: String 
    },
    status: {
        type: String,
        enum: ["Pending", "Approved"],
        default: "Approved" 
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);