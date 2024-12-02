import { Router } from "express";
import { membership } from "../controllers/membership.controller.js";
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router()

router.route("/member").post(
    upload.fields([   //middleware provided by 
        {
            name: "photo",
            maxCount: 1
        }
    ]),
    membership
    )


export default router
