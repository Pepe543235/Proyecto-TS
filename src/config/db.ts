import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    const mongoUrl ="mongodb://admin:admin123@localhost:27017/users?authSource=admin";
    try {
        await mongoose.connect(mongoUrl);
        console.log("Conectado a mongo");
    } catch (error) {
        console.log("Error al conectar mongo: ", error);
    }
}

export default connectDB;