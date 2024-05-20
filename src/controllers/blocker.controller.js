import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Blocker } from "../models/blocker.model.js"
export const ckechSiteStatus = asyncHandler(async (req, res)=>{
    try {
        const {name} = req.body
        if(!name){
            throw new ApiError(400, "Name in req")
        }
        const status = await Blocker.findOne({site: name})
        if(!status){
            throw new ApiError(400, "It does not exist !")
        }
        console.log(status, "yyyyyyyyy");
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        ...status
                    },
                    "fetched status Successfully")
            )
    } catch (error) {
        throw new ApiError(401, "something went wrong in ckechSiteStatus controller ! ( " + error?.message + " )")
    }
})

export const addSite = asyncHandler(async (req, res)=>{
    try {
        const {name, status} = req.body
        
        if(!status || !name){
            throw new ApiError(400, "It does not exist !")
        }
        console.log(status, "yyyyyyyyy");
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        ...status
                    },
                    "fetched status Successfully")
            )
    } catch (error) {
        throw new ApiError(401, "something went wrong in ckechSiteStatus controller ! ( " + error?.message + " )")
    }
})