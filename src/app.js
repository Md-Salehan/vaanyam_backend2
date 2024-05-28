import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from 'fs'
import pdfKit from "pdfkit"
const app = express()

//helps to connect backend nd frontend
//origin: hepls set the frontend that can connect and avoiding others
app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}))

//to accept data in json
app.use(express.json({limit: "16kb"}))
//to accept data from url(params) + encoding it
//extended helps accept nested obj data  
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import blockerRouter from "./routes/blocker.route.js";
import destRouter from "./routes/destination.route.js";
import uploadImage from "./routes/uploadImage.route.js";
import adminRouter from "./routes/admin.route.js";
//routes Declaration

app.use("/api/v1/blk", blockerRouter)
app.use("/api/v1/dest", destRouter)
app.use("/api/v1/upload", uploadImage)
app.use("/api/v1/admin", adminRouter )

export {app};