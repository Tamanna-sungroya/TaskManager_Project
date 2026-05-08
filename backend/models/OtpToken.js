const mongoose = require("mongoose");

const otpTokenSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, lowercase: true, trim: true, index: true },
        otpHash: { type: String, required: true },
        purpose: {
            type: String,
            enum: ["register", "login"],
            required: true,
            index: true,
        },
        expiresAt: { type: Date, required: true, index: true },
        attempts: { type: Number, default: 0 },
        lastSentAt: { type: Date, default: Date.now },
        isUsed: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpToken", otpTokenSchema);
