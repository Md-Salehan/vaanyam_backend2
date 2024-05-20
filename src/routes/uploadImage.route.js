import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { delImage, singleImage } from "../controllers/uploadImage.controller.js";


const router = Router()

router.route("/singleimage").post(upload.fields([
    {
        name: "singleImage",
        maxCount: 1 
    }
]),singleImage)
router.route("/delimg").post(delImage)


export default router;