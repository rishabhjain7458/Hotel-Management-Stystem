const express = require('express');

const roomRouter = express.Router();

const roomControllers = require("./../Controllers/roomsController");

roomRouter.route("/")
.get(roomControllers.getRoomsInfo)
.post(roomControllers.createRoom)

module.exports = roomRouter;