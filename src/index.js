import dotenv from 'dotenv';
dotenv.config({parh: "./.env"});
import express from "express";
import connectDB from "./db/index.js";
import { v2 as cloudinary } from 'cloudinary';
import {app} from "./app.js";

connectDB()
.then(()=>{
    const PORT = process.env.PORT || 8080;

    app.on("error", (error)=>{
        console.log("ERR at app:", error);
        throw error;
    })
    app.listen(PORT, () => {
        console.log(`App is running at ${PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB connection failed !!", err);
})

