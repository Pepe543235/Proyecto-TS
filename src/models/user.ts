import { Document, model, Schema, Types } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    roles: string[]; 
    _id: Types.ObjectId;
    phone: string;
    createDate: Date;
    deleteDate: Date;
    status: boolean;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        required: true,
        default: ['user'] 
    },
    phone: {
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    deleteDate: {
        type: Date
    },
    status: {
        type: Boolean
    }
});

export const User = model<IUser>('User', userSchema, 'user');
