const mongoose = require("mongoose");
const connectDB=async()=>{
    try { 
        mongoose.set('strictQuery', true); // Set strict query mode (or false if you want non-strict)
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connection successful!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}
module.exports = connectDB;


