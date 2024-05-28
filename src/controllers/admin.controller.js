import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefereshTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        const upAdmin = await admin.save({ validateBeforeSave: false })
        console.log(upAdmin);
        console.log(refreshToken);
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
        // console.log(error);
    }
}

export const registerAdmin = asyncHandler(async (req, res) => {
    const { adminName, email, fullName, password, main } = req.body
    if ([adminName, email, fullName, password].some((item => item?.trim() === "")))
        throw new ApiError(400, "All fields required")


    const existedAdmin = await Admin.findOne({
        $or: [{ adminName }, { email }]
    })
    if (existedAdmin)
        throw new ApiError(409, "admin with this email or adminname already existed")

    // let avatarLocalPath;
    // if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length)
    //     avatarLocalPath = req.files?.avatar[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length)
    //     coverImageLocalPath = req.files?.coverImage[0]?.path;


    // let avatar, coverImage
    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required")
    // } else {
    //     avatar = await uploadOnCloudinary(avatarLocalPath)
    // }

    // if (coverImageLocalPath) {
    //     coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // }

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required")
    // }

    const admin = await Admin.create({
        fullName,
        avatar: "",
        coverImage: "",
        email,
        password,
        adminName: adminName.toLowerCase(),
        main: main || false
        // refreshToken: ""
    })

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin")
    }

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Admin registered Successfully")
    )

})

export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, adminName, password } = req.body

    if (!adminName && !email)
        throw new ApiError(400, "Please enter adminname or email !")

    if (!password)
        throw new ApiError(400, "Password requied !")

    const admin = await Admin.findOne({
        $or: [{ adminName }, { email }]
    })

    if (!admin)
        throw new ApiError(400, "Admin does not exist !")

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if (!isPasswordValid)
        throw new ApiError(400, "Invalid admin credential !")

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }


    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin, 
                    accessToken, 
                    refreshToken
                },
                "Admin loged in Successfully")
        )

})

export const logoutAdmin = asyncHandler(async (req, res) => {

    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true // this will help to get updated admin-data response
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Admin logged Out"))
})

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const admin = await Admin.findById(decodedToken._id)

        if (!admin) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== admin.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used") //admin need to login again
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(admin._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "something went wrong while refreshing token !")
    }
})

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        const admin = await Admin.findById(req.admin?._id)

        if (!admin) {
            throw new ApiError(400, "Invalid request, admin not found !")
        }
        const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword)

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid old password")
        }

        admin.password = newPassword
        await admin.save({ validateBeforeSave: false })

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password changed successfully"))

    } catch (error) {
        throw new ApiError(401, "something went wrong while changing password ! ( " + error?.message + " )")
    }

})

export const getCurrentAdmin = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.admin,
            "Admin fetched successfully"
        ))
})

export const getAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.body
    if (!adminId) throw new ApiError(400, "Please give adminId !")

    const admin = await Admin.findById(adminId).select("-password -refreshToken")
    if (!admin) throw new ApiError(400, "No admin found !")

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            admin,
            "Admin fetched successfully"
        ))
})

export const getAllAdmin = asyncHandler(async (req, res) => {
    
    
    const allAdmin = await Admin.find({});
    if (!allAdmin) throw new ApiError(400, "No admin found !")

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            allAdmin,
            "Admin fetched successfully"
        ))
})

export const updateAccountDetails = asyncHandler(async (req, res) => {
    try {
        const attArr = Object.keys(req.body) || []
        if(!attArr?.length) throw new ApiError(400, "Payload is empty !")
    
        let updateObj = {}
    
        attArr.forEach((ele) => {
            if (ele !== "email" && ele !== "fullName") {
                let obj = {
                    ...req.body,
                }
                let list = Object.keys(obj)
                list = list.filter((item)=> (item !== "email" && item !== "fullName"))
                throw new ApiError(400, list.join(", ") + " can not be update")
            }else{
                if(!req.body?.[ele].trim()) 
                    throw new  ApiError(400, `please insert ${ele} value`)
                updateObj = {
                    ...updateObj,
                    [ele]: req.body?.[ele]
                }
            }
        })
    
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.admin._id,
            {
                $set: {
                    ...updateObj
                }
            },
            { new: true }
        ).select("-password -refreshToken")
    
        
    
        return res
        .status(200)
        .json(new ApiResponse(
            200, 
            updatedAdmin, 
            "Account details updated successfully"
        ))
    } catch (error) {
        throw new ApiError(401, "something went wrong while updating admin ! ( " + error?.message + " )")
    }

})