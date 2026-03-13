import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/usersSchema";

interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Token missing"
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const userFind = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    console.log(">>>>>user verify",userFind);
    
    const user = await User.findOne({ token });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid session"
      });
      return;
    }

    req.user = user;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Unauthorized"
    });

  }

};