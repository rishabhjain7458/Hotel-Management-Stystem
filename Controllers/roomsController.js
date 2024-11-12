const express = require("express");
const Rooms = require('./../Models/roomsModel');
const apiFeatures = require('./../utils/apiFeatures');

// Get all rooms with optional filtering, sorting, and pagination
exports.getFilteredRooms = async (req, res) => {
    try {
        const features = new apiFeatures(Rooms.find(), req.query)
            .filter()
            .sort()
            .limit_fields()
            .pagination();

        const rooms = await features.query;

        res.status(200).json({
            status: 'success',
            results: rooms.length,
            data: {
                rooms: rooms
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

// Get a single room by ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Rooms.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                status: 'fail',
                message: 'No room found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                room: room
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

// Create a new room
exports.createRoom = async (req, res) => {
    try {
        const room = await Rooms.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                room: room
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

// Update a room by ID
exports.updateRoom = async (req, res) => {
    try {
        const room = await Rooms.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!room) {
            return res.status(404).json({
                status: 'fail',
                message: 'No room found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                room: room
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

// Delete a room by ID
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Rooms.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({
                status: 'fail',
                message: 'No room found with that ID'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

// Delete all rooms
exports.deleteAllRooms = async (req, res) => {
    try {
        await Rooms.deleteMany({});
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}
