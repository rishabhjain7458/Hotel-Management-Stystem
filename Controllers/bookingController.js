const express = require("express");
const fs=require("fs")
const app=express();

const Rooms = require("./../Models/roomsModel.js")
const apiFeatures = require("./../utils/apiFeatures.js");
const Bookings = require("../Models/bookingsModel.js");
const mongoose = require("mongoose");

exports.getbookings = async(req,res)=>{
    try{
        const features =new apiFeatures(Bookings.find(),req.query).filter().sort().limit_fields().pagination()
        let bookings = await features.query
        res.status(200).json({
            status: "success",
            length:bookings.length,
            data:{
                bookings:bookings
            }
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
    }
}

exports.bookRoom = async (req, res) => {
    try {
        // Create the booking
        const booking = await Bookings.create(req.body);

        // Update the room's availability status
        await Rooms.findByIdAndUpdate(new mongoose.Types.ObjectId(req.body.roomId), { readyForCheckIn: false });


        console.log(booking);

        res.status(201).json({
            status: "success",
            data: {
                booking: booking
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};