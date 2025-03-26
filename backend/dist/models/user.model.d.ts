import { Schema, Types } from "mongoose";
export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    fullName?: string;
    password: string;
    profilePic?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const User: import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, Schema<IUser, import("mongoose").Model<IUser, any, any, any, import("mongoose").Document<unknown, any, IUser> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IUser, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IUser>> & import("mongoose").FlatRecord<IUser> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>>;
export default User;
