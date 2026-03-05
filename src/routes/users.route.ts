import express from "express";
import { 
  
  googleAuth,
  googleAuthCallback,
  sendOTPController, 

  verifyOTPController, 
} from "../controllers/usersAuth.controller";
import { getEnv } from "../shared/utils";
import { globalLimiter } from "../middleware/tokenBucketRatelimiter";

const router = express.Router();


// router.post("/signup", signupUser);

// router.post("/verify/:phone", verifyUserOTPController);



// router.post("/login", loginUserController);

router.post(getEnv("SEND_OTP"), sendOTPController);
router.post(getEnv("VERIFY_OTP"),globalLimiter, verifyOTPController);


router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;
