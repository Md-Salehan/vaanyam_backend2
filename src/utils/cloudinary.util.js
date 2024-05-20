import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


const uploadOnCloudinary = async (localFilePath) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true,
        });
        
        if (!localFilePath) return null;
        //upload to cloudinary
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // console.log(`File uploaded: Successfully at ${res}`, res);
        fs.unlinkSync(localFilePath)
        return res;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null
    }
}

const deleteFromCloudinary = async(public_Id)=>{
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true,
        });
    
        const result = await cloudinary.uploader
        .destroy([public_Id], {resource_type: 'image', type: 'upload', invalidate: true})
        ;
    
        return result
    } catch (error) {
        return {result : "notOk"}
    }
}

export { 
    uploadOnCloudinary,
    deleteFromCloudinary
}
