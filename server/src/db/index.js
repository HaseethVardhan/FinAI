import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/FinAI`)
        console.log(`MongoDB connected at ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MONGODB connection FAILED ${error}`)
        process.exit(1)
    }
}

export default connectDB