import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-token"];
        if (!token) {
            res.status(401).json({ message: "Unauthorized - No Token Provided" });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ message: "Unauthorized - Invalid Token" });
            return;
        }
        if (typeof decoded === "object" &&
            decoded !== null &&
            "userId" in decoded) {
            const userId = decoded.userId;
            const user = await User.findById(userId).select("-password");
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            req.user = user;
        }
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            console.log("Error in protectRouter middleware : ", err.message);
            res.status(500).json({ message: "Internal server error." });
        }
    }
};
export default protectRoute;
