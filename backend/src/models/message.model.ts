import { Schema, model, Types } from "mongoose";

export interface IMessage {
  _id: Types.ObjectId;
  receiverId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: String;
  image: String;
}

const messageSchema = new Schema(
  {
    senderId: { type: Types.ObjectId, ref: "User", required: true },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: String,
    image: String,
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);
export default Message;
