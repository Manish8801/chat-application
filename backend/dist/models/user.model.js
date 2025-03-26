import { Schema, model } from "mongoose";
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String },
    password: { type: String, required: true, minLength: 8 },
    profilePic: { type: String, default: "" },
}, { timestamps: true });
const User = model("User", userSchema);
export default User;
