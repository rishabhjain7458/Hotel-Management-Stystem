const express = require("express");
const fs = require("fs");
const app = express();

const Rooms = require('./../Models/roomsModel.js');
const apiFeatures = require("./../utils/apiFeatures.js");

exports.getRoomsInfo = async (req, res) => {
    try {
        // Fetch all rooms without any filters
        const rooms = await Rooms.find(); // Get all rooms

        res.status(200).json({
            status: "success",
            length: rooms.length,
            data: {
                rooms: rooms
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}


exports.createRoom = async (req, res) => {
    try {
        const room = await Rooms.create(req.body);
        console.log(room);
        res.status(201).json({
            status: "success",
            data: {
                room: room
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

exports.deleteRoom = async (req, res) => {
    try {
        const room = await Rooms.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({
                status: "fail",
                message: "No room found with that ID"
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

exports.deleteAllRooms = async (req, res) => {
    try {
        const result = await Rooms.deleteMany({});

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
