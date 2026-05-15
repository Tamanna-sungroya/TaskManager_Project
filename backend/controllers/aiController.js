const Task = require("../models/Task");
const { generateAdvice } = require("../services/aiService");

const askAssistant = async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ success: false, message: "Query is required" });
        }
        
        const tasks = await Task.find({ assignedTo: req.user._id, deletedAt: null }).lean();

        const result = await generateAdvice({
            query: query || "Plan my day",
            tasks,
        });

        console.log("AI Assistant Response:", { query, adviceLength: result.advice?.length });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('AI assistant failed:', error);
        console.error('Stack:', error.stack);
        return res.status(500).json({ success: false, message: "AI assistant failed", error: error.message });
    }
};

const streamAssistant = async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ success: false, message: "Query is required" });
        }
        
        const tasks = await Task.find({ assignedTo: req.user._id, deletedAt: null }).lean();
        const result = await generateAdvice({
            query: query || "Plan my day",
            tasks,
        });

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.setHeader("Cache-Control", "no-cache");

        const advice = result.advice || "Could not generate advice right now.";
        console.log("Streaming advice of length:", advice.length);
        
        const chunks = advice.split(" ");
        for (let i = 0; i < chunks.length; i += 1) {
            res.write(`${chunks[i]} `);
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
        res.end();
    } catch (error) {
        console.error('AI stream failed:', error);
        console.error('Stack:', error.stack);
        res.status(500).end("Stream error");
    }
};

module.exports = { askAssistant, streamAssistant };
