import express from "express"
import { addProductController, adminLogin, updateProductController,  } from "../controllers/adminAuth.controller"
import { upload } from "../services/multer.service"
import { getEnv } from "../shared/utils"


const router = express.Router()

// router.get('/', (_req,res)=>{
//     res.send("working admin route")
// })

router.post(getEnv("ADMIN_LOGIN"),adminLogin)
router.post(getEnv("CREATE_PRODUCT_API"),upload.array("images"),addProductController)
router.put(getEnv("UPDATE_PRODUCT_API"), updateProductController)




export default router