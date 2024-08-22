const express = require('express');
const app = express();

const mongoose = require('mongoose')
const roomRouter = require('./Routes/roomsRouter');

mongoose.connect("mongodb+srv://admin:hellow9rld@mydb.efzewbx.mongodb.net/hotelTaj?retryWrites=true&w=majority&appName=myDB").then((conn)=>{
    console.log("hello")
    console.log("DB Connection successfull")
}).catch((err)=>{
    console.log("hello2")
    console.log("Some error has occured" , err);
})


app.use(express.json());
app.use("/",roomRouter);
module.exports = app;

