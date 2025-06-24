import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully!");
    } catch (err) {
        console.error(`Database Connection Error: ${err.message}`);
        process.exit(1); 
    }
};

export default connectToDatabase;
