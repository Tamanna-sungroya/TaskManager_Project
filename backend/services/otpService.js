const bcrypt = require("bcryptjs");
const OtpToken = require("../models/OtpToken");
const { sendEmail } = require("./emailService");

const OTP_EXP_MIN = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const OTP_COOLDOWN_SEC = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

const createCode = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const issueOtp = async ({ email, purpose }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await OtpToken.findOne({
        email: normalizedEmail,
        purpose,
        isUsed: false,
        expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (existing) {
        const diffSec = Math.floor((Date.now() - new Date(existing.lastSentAt).getTime()) / 1000);
        if (diffSec < OTP_COOLDOWN_SEC) {
            return { blocked: true, retryAfter: OTP_COOLDOWN_SEC - diffSec };
        }
    }

    const otp = createCode();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXP_MIN * 60 * 1000);

    await OtpToken.create({
        email: normalizedEmail,
        otpHash,
        purpose,
        expiresAt,
        lastSentAt: new Date(),
    });

    await sendEmail({
        to: normalizedEmail,
        subject: `Task Forge ${purpose === "register" ? "Registration" : "Login"} OTP`,
        html: `<p>Your OTP is <b>${otp}</b>.</p><p>Expires in ${OTP_EXP_MIN} minutes.</p>`,
    });

    return { blocked: false, expiresAt };
};

const verifyOtp = async ({ email, otp, purpose }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const token = await OtpToken.findOne({
        email: normalizedEmail,
        purpose,
        isUsed: false,
    }).sort({ createdAt: -1 });

    if (!token || token.expiresAt < new Date()) return { ok: false, reason: "OTP expired or not found" };
    if (token.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: "OTP attempts exceeded" };

    const valid = await bcrypt.compare(otp, token.otpHash);
    if (!valid) {
        token.attempts += 1;
        await token.save();
        return { ok: false, reason: "Invalid OTP" };
    }

    token.isUsed = true;
    await token.save();
    return { ok: true };
};

module.exports = { issueOtp, verifyOtp };
