const express = require('express');
const app = express();

const mongoose = require('mongoose');
const roomRouter = require('./Routes/roomsRouter');
const bookingRouter = require('./Routes/bookingRouter');
const authRouter = require('./Routes/authRouter'); // Ensure this path is correct

mongoose.connect("mongodb+srv://admin:hellow9rld@mydb.efzewbx.mongodb.net/hotelTaj?retryWrites=true&w=majority&appName=myDB")
  .then((conn) => {
    console.log("DB Connection successful");
  })
  .catch((err) => {
    console.log("Some error has occurred", err);
  });

app.use(express.json());

// Use the correct path for authRouter
app.use("/api/v1/users", authRouter);

app.use("/rooms", roomRouter);
app.use("/bookings", bookingRouter);

module.exports = app;
