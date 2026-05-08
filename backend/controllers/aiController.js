const Task = require("../models/Task");
const { generateAdvice } = require("../services/aiService");

const askAssistant = async (req, res) => {
    try {
        const { query } = req.body;
        const tasks = await Task.find({ assignedTo: req.user._id, deletedAt: null }).lean();

        const result = await generateAdvice({
            query: query || "Plan my day",
            tasks,
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "AI assistant failed", error: error.message });
    }
};

const streamAssistant = async (req, res) => {
    try {
        const { query } = req.body;
        const tasks = await Task.find({ assignedTo: req.user._id, deletedAt: null }).lean();
        const result = await generateAdvice({
            query: query || "Plan my day",
            tasks,
        });

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.setHeader("Cache-Control", "no-cache");

        const chunks = (result.advice || "").split(" ");
        for (let i = 0; i < chunks.length; i += 1) {
            res.write(`${chunks[i]} `);
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
        res.end();
    } catch (error) {
        res.status(500).json({ success: false, message: "AI stream failed", error: error.message });
    }
};

module.exports = { askAssistant, streamAssistant };
