const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB connected");
    } catch(err) {
        console.error("Error connecting to MongoDB:", err.message);
        if ((err.message || "").includes("querySrv ECONNREFUSED")) {
            console.error(
                "MongoDB SRV DNS lookup failed. Try switching to a non-SRV Atlas URI or update DNS/network settings."
            );
        }
        console.log("Retrying MongoDB connection in 10 seconds...");
        setTimeout(connectDB, 10000);
    }
};

module.exports = connectDB;