import { Schema, model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  fullName?: string; // Optional field
  password: string;
  profilePic?: string;
  createdAt?: Date; // Added due to timestamps
  updatedAt?: Date; // Added due to timestamps
}


const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String },
    password: { type: String, required: true, minLength: 8 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
