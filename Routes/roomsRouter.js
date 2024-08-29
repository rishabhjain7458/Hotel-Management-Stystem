const express = require('express');

const roomRouter = express.Router();

const roomControllers = require("./../Controllers/roomsController");

roomRouter.route("/")
.get(roomControllers.getRoomsInfo)
.post(roomControllers.createRoom)
.delete(roomControllers.deleteAllRooms)

roomRouter.route("/:id")
.delete(roomControllers.deleteRoom)

module.exports = roomRouter;