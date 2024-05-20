import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Destination } from "../models/destination.model.js";



export const addDest = asyncHandler(async (req, res) => {
    // const resData=req.body
    
    const resData = await Destination.create({
        ...req?.body
    })

    if(!resData)
        throw new ApiError(500, "Something went wrong while Adding Destination ")

    return res.status(200).json(
        new ApiResponse(200, resData, "Destination Added Successfully")
    )

})

export const editDest = asyncHandler(async (req, res) => {
    // const resData=req.body
    
    const updatedDest = await Destination.findByIdAndUpdate(req?.body?._id, 
        { $set: req?.body},
        { new: true });

    if(!updatedDest)
        throw new ApiError(500, "Something went wrong while updating Destination ")

    return res.status(200).json(
        new ApiResponse(200, updatedDest, "Destination Added Successfully")
    )

})

export const getAll = asyncHandler(async (req, res) => {
    // const resData=req.body
    
    const allDest = await Destination.find();

    if(!allDest)
        throw new ApiError(500, "Something went wrong while fetching all all Destination ")

    return res.status(200).json(
        new ApiResponse(200, allDest, "Destination Added Successfully")
    )

})

export const deleteDest = asyncHandler(async (req, res) => {
    // const resData=req.body
    
    const dest = await Destination.findById(req?.body?._id);
    const deletedDest = await dest.deleteOne();
    if(!deletedDest)
        throw new ApiError(500, "Something went wrong while deleting Destination ")

    return res.status(200).json(
        new ApiResponse(200, deleteDest, "Destination deleted Successfully")
    )

})
