import { Router } from "express";
import { getHomePageVideo } from "../controllers/video.controller.js";

const router = Router()
router.route("/homepagevideo").get(getHomePageVideo)

export default router;