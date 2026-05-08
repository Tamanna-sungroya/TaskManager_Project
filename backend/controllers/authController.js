const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { issueOtp, verifyOtp } = require("../services/otpService");
const OtpToken = require("../models/OtpToken");

//Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d"});
};

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try{
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase().trim(), deletedAt: null });
        if(userExists){
            return res.status(400).json({ message: "User already exists" });
        }

        const verifiedOtp = await OtpToken.findOne({
            email: email.toLowerCase().trim(),
            purpose: "register",
            isUsed: true,
        }).sort({ updatedAt: -1 });
        if (!verifiedOtp || new Date(verifiedOtp.updatedAt).getTime() < Date.now() - 30 * 60 * 1000) {
            return res.status(400).json({ message: "Please verify registration OTP first" });
        }

        //Determine user role: Amin if correct token is provided, otherwise member
        let role = "member";
        if(adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN){
            role = "admin";
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new user
        const user =await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            profileImageUrl,
            role,
            isActive: true,
        });

        //Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        });
    } catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        const  user = await User.findOne({ email: email.toLowerCase().trim(), deletedAt: null });
        if(!user){
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if(!user.password) {
            return res.status(400).json({ message: "Use Google or OTP login for this account" });
        }
        if(!user.isActive) {
            return res.status(403).json({ message: "Account not active. Verify registration OTP." });
        }

        //Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //Return user data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        });
    } catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const initiateRegisterOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await issueOtp({ email, purpose: "register" });
        if (result.blocked) {
            return res.status(429).json({ message: `Please retry in ${result.retryAfter}s` });
        }
        return res.status(200).json({ message: "OTP sent to email", expiresAt: result.expiresAt });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
};

const verifyRegisterOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await verifyOtp({ email, otp, purpose: "register" });
        if (!result.ok) return res.status(400).json({ message: result.reason });
        return res.status(200).json({ message: "OTP verified" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to verify OTP", error: error.message });
    }
};

const initiateLoginOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim(), deletedAt: null });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.isActive) return res.status(403).json({ message: "User not active" });
        const result = await issueOtp({ email, purpose: "login" });
        if (result.blocked) {
            return res.status(429).json({ message: `Please retry in ${result.retryAfter}s` });
        }
        return res.status(200).json({ message: "OTP sent to email", expiresAt: result.expiresAt });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
};

const verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await verifyOtp({ email, otp, purpose: "login" });
        if (!result.ok) return res.status(400).json({ message: result.reason });

        const user = await User.findOne({ email: email.toLowerCase().trim(), deletedAt: null });
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to verify OTP", error: error.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: "Google idToken is required" });

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email.toLowerCase().trim();

        let user = await User.findOne({ email, deletedAt: null });
        if (!user) {
            user = await User.create({
                name: payload.name || email.split("@")[0],
                email,
                profileImageUrl: payload.picture || null,
                googleId: payload.sub,
                isActive: true,
                role: "member",
            });
        } else {
            user.googleId = payload.sub;
            user.isActive = true;
            await user.save();
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: "Google login failed", error: error.message });
    }
};

// @desc   Get user profile
// @route  GET /api/auth/profile
// @access Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.profileImageUrl) {
            user.profileImageUrl = req.body.profileImageUrl;
        }
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        const updateUser = await user.save();
        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            profileImageUrl: updateUser.profileImageUrl,
            token: generateToken(updateUser._id),
        });
    } catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    initiateRegisterOtp,
    verifyRegisterOtp,
    initiateLoginOtp,
    verifyLoginOtp,
    googleLogin,
};