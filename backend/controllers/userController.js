const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc   Get all users (Admin only)
// @route  GET /api/users/
// @access Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member", deletedAt: null }).select("-password");

        //Add task counts to each user
        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending",
                });
                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress",
                });
                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed",
                });

                return {
                    ...user._doc,  //Include all existing user data
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                };
            })
        );
        res.json({ users: usersWithTaskCounts });  
    } catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Get user by ID
// @route  GET /api/users/:id
// @access Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, deletedAt: null }).select("-password");
        if(!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role = "member" } = req.body;
        const exists = await User.findOne({ email: email.toLowerCase().trim(), deletedAt: null });
        if (exists) return res.status(400).json({ message: "Email already in use" });

        const hash = await bcrypt.hash(password || "Password@123", 10);
        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hash,
            role,
            isActive: true,
        });
        return res.status(201).json({ message: "User created", user: { ...user.toObject(), password: undefined } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, deletedAt: null });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = req.body.name || user.name;
        user.email = req.body.email ? req.body.email.toLowerCase().trim() : user.email;
        user.role = req.body.role || user.role;
        user.isActive = typeof req.body.isActive === "boolean" ? req.body.isActive : user.isActive;
        if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);

        await user.save();
        return res.status(200).json({ message: "User updated", user: { ...user.toObject(), password: undefined } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, deletedAt: null });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.deletedAt = new Date();
        user.isActive = false;
        await user.save();

        await Task.updateMany(
            { assignedTo: user._id, deletedAt: null },
            { $pull: { assignedTo: user._id } }
        );

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };