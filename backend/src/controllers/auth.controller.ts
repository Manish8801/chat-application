import { Request, Response } from "express";
import User, { IUser } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/utils.js";
import cloudinary from "../lib/cloudinary.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const signup = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "missing required fields." });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
      return;
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      res.status(400).json({ message: "User creation failed." });
      return;
    }

    generateToken(newUser._id, res);
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email,
      profilePic: newUser.profilePic,
    });

  } catch (err) {
    if (err instanceof Error) {
      console.log("Error in signup controller", err.message);
      res.status(500).json({ message: "Internal Server Error." });
    }
  }
  return;
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    generateToken(user._id, res);

    const { fullName, _id, profilePic } = user;

    res.status(200).json({
      email,
      fullName,
      _id,
      profilePic,
    });

    return;
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error in login controller", err.message);
      return;
    }
  }
};

const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt-token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error in logout controller.", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return;
};

const updateProfile = async (req: Request, res: Response) => {
  const { profilePic } = req.body;

  try {
    const userId = req.user?._id;

    if (!profilePic) {
      res.status(400).json({ message: "Profile pic required" });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error in authController", err.message);
    }
  }
};

const checkAuth = async (req: Request, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error in checkAuth controller", err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export { signup, login, logout, updateProfile, checkAuth };
