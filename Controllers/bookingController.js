const express = require("express");
const app=express();

const Rooms = require("./../Models/roomsModel.js")
const apiFeatures = require("./../utils/apiFeatures.js");
const Bookings = require("../Models/bookingsModel.js");
const mongoose = require("mongoose");

exports.getbookings = async(req,res)=>{
    try{
        let bookings = await Bookings.find();
        res.status(200).json({
            status: "success",
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
        console.log(req.params);
        const testbooking=await Rooms.findOneAndUpdate({name: req.body.roomBooked, "readyForCheckIn": false });
        console.log(testbooking);

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
}


exports.deleteBooking = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid ID format"
            });
        }
        const roomIdToDelete = await Bookings.findById(req.params.id,)
        const result = await Rooms.findOneAndUpdate({name: req.body.roomBooked, "readyForCheckIn": true });
        console.log(result);
        const booking = await Bookings.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({
                status: "fail",
                message: "No booking found with that ID"
            });
        }

        res.status(204).json({
            status: "success",
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

exports.deleteAllBookings = async (req, res) => {
    try {
        // Attempting to perform the delete operation
        const result = await Bookings.deleteMany({});
        
        // If the operation succeeds, send a 204 No Content response
        res.status(204).json({
            status: "success",
            data: null
        });
    } catch (err) {
        // If there's an error, send a 400 Bad Request response with the error message
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}



