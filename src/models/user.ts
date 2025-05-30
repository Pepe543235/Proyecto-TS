import { Document, model, Schema, Types } from "mongoose";
export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    role:string;
    _id: Types.ObjectId;
    phone:string;
    createDate:Date;
    deleteDate:Date;
    status:Boolean;
}

const userSchema= new Schema<IUser>({
    name:{
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

export const User = model<IUser>('User', userSchema,'user');
