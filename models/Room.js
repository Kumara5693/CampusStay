const mongoose=require("mongoose");
const roomSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    location:{
        type: String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    isAvailable:{
        type: Boolean,
        default:true
    }
},
{timestamps:true}
);
module.exports= mongoose.model("Room",roomSchema);