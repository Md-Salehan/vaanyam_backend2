import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { addDest, deleteDest, editDest, getAll } from "../controllers/destination.controller.js";

const router = Router()

router.route("/add").post(addDest)
router.route("/edit").post(editDest)
router.route("/getall").get(getAll)
router.route("/del").post(deleteDest)
export default router;