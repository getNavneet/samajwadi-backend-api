import { Router } from "express";
import { greetings } from "../controllers/greeting.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router()

router.route("/greeting").post(
    upload.fields([   //middleware provided by
        {
            name: "photo",
            maxCount: 1
        }
    ]),
    greetings
    )


export default router
