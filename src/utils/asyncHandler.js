// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next))
//         .catch((err) => {console.log("&&&&&&&&&"); next(err)})
//     }
// }

// export { asyncHandler } 

import { ApiResponse } from "./apiResponce.js";

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => {
            console.log(err);
            res.status(err.statusCode || 500)
            .json(
                new ApiResponse(
                    err.statusCode || 500, 
                    {},
                    err.message || "Something went wrong !"
                )
            )
        })
    }
}

export { asyncHandler } 


// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }