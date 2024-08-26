const express = require("express");
const fs=require("fs")
const app=express();

const Rooms = require('./../Models/roomsModel.js');
const apiFeatures = require("./../utils/apiFeatures.js");

exports.getRoomsInfo = async (req,res)=>{
    try{
        const features = new apiFeatures(Rooms.find(),req.query).filter().sort().limit_fields().pagination()
        let rooms = await features.query;
        res.status(200).json({
            status: "success",
            length:rooms.length,
            data:{
                rooms:rooms
            }
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
    }
}

exports.createRoom = async(req,res)=>{
    try{
        const room = await Rooms.create(req.body);
        console.log(room)
        res.status(201).json({
            status: "success",
            data:{
                room:room
            }
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
    }
}
