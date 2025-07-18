import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    const mongoUrl ="mongodb+srv://admin:admin@cluster0.dbbqj3l.mongodb.net/";
    try {
        await mongoose.connect(mongoUrl);
        console.log("Conectado a mongo");
    } catch (error) {
        console.log("Error al conectar mongo: ", error);
    }
}

export default connectDB;