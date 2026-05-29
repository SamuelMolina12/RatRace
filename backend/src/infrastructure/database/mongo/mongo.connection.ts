import mongoose from "mongoose";

export const connectMongo = async () => {
    try {
        const uri = process.env.MONGO_URI as string;

        await mongoose.connect(uri);

        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error conectando MongoDB", error);
        process.exit(1);
    }
};