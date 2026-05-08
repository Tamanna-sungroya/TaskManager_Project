const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
        password: { type: String },
        profileImageUrl: { type: String, default: null },
        role: { type: String, enum: ["admin", "member"], default: "member", index: true },
        isActive: { type: Boolean, default: false, index: true },
        otpLoginEnabled: { type: Boolean, default: true },
        googleId: { type: String, default: null },
        deletedAt: { type: Date, default: null, index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);