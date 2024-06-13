import { fileURLToPath } from "url";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs, { createReadStream, statSync } from "fs"
import { dirname} from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const getHomePageVideo = asyncHandler(async (req, res) => {
    const filePath = path.join(__dirname, '../../public/video/introVideo.mp4');
    
    const range = req.headers.range
    if(!range) 
        throw new ApiError(409, "file range required")
    const stat = statSync(filePath)
    const fileSize = stat.size
    const chunkSize = 10**5;
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start+chunkSize, fileSize)
    console.log(start, end, fileSize, stat);
    const fileStream = createReadStream(filePath,{
        start,
        end
    })
    const contentLength = end - start + 1
    const header = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    fileStream.pipe(res)
    return res.writeHead(206, header)
})