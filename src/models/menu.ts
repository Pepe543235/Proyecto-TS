import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
    nombre: string;
    email: string;
    password: string;
    roles: Types.ObjectId[];
    _id: Types.ObjectId;
    phone: string;
    createDate: Date;
    deleteDate: Date;
    status: boolean;
}

const userSchema = new Schema<IUser>({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: Types.ObjectId, ref: "Role", required: true }],
    phone: { type: String },
    createDate: { type: Date, default: Date.now },
    deleteDate: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
});

export const User = model<IUser>("User", userSchema, 'users');
