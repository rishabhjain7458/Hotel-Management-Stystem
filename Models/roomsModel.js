const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:"./config.env"}); // to connect config
const fs = require("fs");

//To connect to mongoDB using mongoose
// mongoose.connect("mongodb+srv://admin:hellow9rld@mydb.efzewbx.mongodb.net/hotelTaj?retryWrites=true&w=majority&appName=myDB").then((conn)=>{
//     console.log("hello")
//     console.log("DB Connection successfull")
// }).catch((err)=>{
//     console.log("hello2")
//     console.log("Some error has occured" , err);
// })

//Schema->Model->CURD

const roomSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Name is a required field!'],
        unique: true,
    },
    price:{
        type: Number,
        required:[true,'Price is a required field']
    },
    occupancy:{
        type: Number,
        required:[true,'Occupancy is a required field']
    },
    amenityFeature:{
        type: String
    },
    telephone:{
        type: String
    },
    readyForCheckIn:{
        type: Boolean
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)

const Rooms=mongoose.model("rooms",roomSchema);


module.exports = Rooms;