import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req?.cookies?.accessToken || req?.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request !")
        }

        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const admin = await Admin.findById(decodedToken?._id)?.select("-password -refreshToken")

        if(!admin){
            throw new ApiError(401, "Invalid Access Token !")
        }
        req.admin = admin
        next()

    } catch (error) {
        throw new ApiError(401, "something went wrong while verifing JWT ! ( " + error?.message + " )")
    }
})