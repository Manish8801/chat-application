import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
const getUsersForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user?._id;
        const filteredUsers = await User.find({
            _id: { $ne: loggedUserId },
        }).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log("Error from getUsersForSidebar", err.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};
const getMessages = async (req, res) => {
    try {
        const { id: partnerId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: partnerId },
                { senderId: partnerId, receiverId: myId },
            ],
        });
        res.status(200).json(messages);
        return;
    }
    catch (err) {
        if (err instanceof Error) {
            console.log("Error from getMessages", err.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};
const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?._id;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        // socket.io
        res.status(201).json(newMessage);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log("Error from sendMessages", err.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};
export { getUsersForSidebar, getMessages, sendMessage };
