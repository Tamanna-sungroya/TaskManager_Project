const express = require("express");
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    initiateRegisterOtp,
    verifyRegisterOtp,
    initiateLoginOtp,
    verifyLoginOtp,
    googleLogin,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { validate, authSchemas } = require("../middlewares/validateMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

//Auth Routes
router.post("/register", validate(authSchemas.register), registerUser);  //Register User
router.post("/login", validate(authSchemas.login), loginUser);        //Login User
router.post("/register/otp/send", initiateRegisterOtp);
router.post("/register/otp/verify", verifyRegisterOtp);
router.post("/login/otp/send", initiateLoginOtp);
router.post("/login/otp/verify", verifyLoginOtp);
router.post("/google", googleLogin);
router.get("/profile", protect, getUserProfile);  //Get User Profile
router.put("/profile", protect, updateUserProfile);  //Update User Profile

// DEBUG endpoint to check what's in database
router.get("/profile/debug/:userId", async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log('=== DEBUG: Raw user from DB ===');
        console.log('User object:', user);
        console.log('ProfileImageUrl field:', user.profileImageUrl);
        console.log('User._doc:', user._doc);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            profileImageUrlRaw: user._doc?.profileImageUrl,
            allFields: Object.keys(user._doc)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/upload-image", upload.single("image"), (req, res) => {
    if(!req.file){
        console.log('No file uploaded');
        return res.status(400).json({ message: "No file uploaded" });
    }
    const protocol = req.protocol || 'http';
    const host = req.get("host") || 'localhost:5000';
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    console.log('=== IMAGE UPLOAD ===');
    console.log('File uploaded:', req.file.filename);
    console.log('Protocol:', protocol);
    console.log('Host:', host);
    console.log('Generated URL:', imageUrl);
    res.status(200).json({ imageUrl, filename: req.file.filename });
});

module.exports = router;