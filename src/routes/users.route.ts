import express from "express";
import { 
  
  sendOTPController, 

  verifyOTPController, 
} from "../controllers/usersAuth.controller";
import { getEnv } from "../shared/utils";

const router = express.Router();


// router.post("/signup", signupUser);

// router.post("/verify/:phone", verifyUserOTPController);



// router.post("/login", loginUserController);

router.post(getEnv("SEND_OTP"), sendOTPController);
router.post(getEnv("VERIFY_OTP"), verifyOTPController);

export default router;
