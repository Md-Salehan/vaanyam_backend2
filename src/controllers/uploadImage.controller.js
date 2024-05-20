import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs"

export const singleImage = asyncHandler(async (req, res) => {
    // const resData=req.body
    let imgName;
    if (req.files && Array.isArray(req.files.singleImage) && req.files.singleImage.length){
        let localFilePath = req.files?.singleImage[0]?.path
        let arr = localFilePath.split("/");
        imgName = arr[arr.length - 1]
    }
        

    if (!imgName) 
        throw new ApiError(400, "file is required")
    
    return res.status(200).json(
        new ApiResponse(200, {imgName}, "image Added Successfully")
    )

})

export const delImage = asyncHandler(async (req, res) => {
    // const resData=req.body
    fs.unlinkSync("public/temp/"+req?.body?.imgName)
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Deleted Successfully")
    )

})

export const editImage = asyncHandler(async (req, res) => {
    // const resData=req.body
    let imgName;
    if (req.files && Array.isArray(req.files.singleImage) && req.files.singleImage.length){
        let localFilePath = req.files?.singleImage[0]?.path
        let arr = localFilePath.split("/");
        imgName = arr[arr.length - 1]
    }
        

    if (!imgName) 
        throw new ApiError(400, "file is required")
    
    fs.unlinkSync("public/temp/"+req?.body?.imgName)
    
    return res.status(200).json(
        new ApiResponse(200, {}, "edited Successfully")
    )

})
