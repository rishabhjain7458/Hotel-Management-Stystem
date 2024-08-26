const mongoose = require("mongoose");
const Rooms = require("./../Models/roomsModel.js")

exports.checkRoomAvailability = async (req, res, next) => {
    try {
        // Convert the id from the URL to a MongoDB ObjectId
        const room = await Rooms.findById(new mongoose.Types.ObjectId(req.params.id));

        if (!room) {
            return res.status(404).json({
                status: "fail",
                message: "Room not found",
            });
        }

        if (room.readyForCheckIn === false) {
            return res.status(400).json({
                status: "fail",
                message: "Room is already booked",
            });
        }

        // Proceed to the next middleware
        next();
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};
