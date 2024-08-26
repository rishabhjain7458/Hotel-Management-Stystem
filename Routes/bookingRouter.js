const express = require('express');

const bookingRouter = express.Router();

const roomMiddleware = require("./../Middlewares/roomMiddleware.js")

const bookingConrollers = require("./../Controllers/bookingController.js")

bookingRouter.route("/")
.get(bookingConrollers.getbookings)


bookingRouter.route("/:id")
.post(roomMiddleware.checkRoomAvailability,bookingConrollers.bookRoom);

module.exports = bookingRouter;