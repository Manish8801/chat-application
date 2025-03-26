import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Response } from "express";


function generateToken(userId: mongoose.Types.ObjectId, res: Response) {
  const token  = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("jwt-token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
}

export default generateToken;
