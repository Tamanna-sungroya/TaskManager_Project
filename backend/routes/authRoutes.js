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

router.post("/upload-image", upload.single("image"), (req, res) => {
    if(!req.file){
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

module.exports = router;