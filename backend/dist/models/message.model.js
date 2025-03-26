import { Schema, model, Types } from "mongoose";
const messageSchema = new Schema({
    senderId: { type: Types.ObjectId, ref: "User", required: true },
    receiverId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: String,
    image: String,
}, { timestamps: true });
const Message = model("Message", messageSchema);
export default Message;
