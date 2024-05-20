import { Router } from "express";
import { ckechSiteStatus } from "../controllers/blocker.controller.js";

const router = Router()
router.route("/checkstatus").post(ckechSiteStatus)

export default router;