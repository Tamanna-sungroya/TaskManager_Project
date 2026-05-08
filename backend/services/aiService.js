const OpenAI = require("openai");

const getPriorityWeight = (priority) => {
    if (priority === "High") return 4;
    if (priority === "Medium") return 2;
    return 1;
};

const scoreTask = (task) => {
    const now = Date.now();
    const due = new Date(task.dueDate).getTime();
    const hoursLeft = Math.max((due - now) / (1000 * 60 * 60), -72);
    const overduePenalty = hoursLeft < 0 ? Math.min(Math.abs(hoursLeft) / 3, 20) : 0;
    const urgency = hoursLeft > 0 ? Math.max(0, 20 - hoursLeft / 2) : 25;
    const quickWin = (task.todoChecklist?.length || 0) <= 2 ? 3 : 0;
    const statusPenalty = task.status === "Completed" ? -100 : 0;

    return getPriorityWeight(task.priority) * 10 + urgency + overduePenalty + quickWin + statusPenalty;
};

const buildContext = (tasks) =>
    tasks
        .filter((t) => t.status !== "Completed")
        .map((t) => ({
            id: `${t._id}`,
            title: t.title,
            priority: t.priority,
            status: t.status,
            dueDate: t.dueDate,
            score: Number(scoreTask(t).toFixed(2)),
        }))
        .sort((a, b) => b.score - a.score);

const generateAdvice = async ({ query, tasks }) => {
    const rankedTasks = buildContext(tasks);

    if (!process.env.OPENAI_API_KEY) {
        return {
            rankedTasks,
            advice: `Start with "${rankedTasks[0]?.title || "your highest priority pending task"}", then batch similar medium-priority items. You are ${rankedTasks.length > 5 ? "carrying a high workload; time-blocking is recommended." : "on manageable workload."}`,
        };
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = {
        userQuery: query,
        rankedTasks,
        instructions:
            "You are Forge AI Assistant. Give practical productivity advice, include concrete next 3 actions.",
    };

    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: JSON.stringify(prompt),
    });

    return {
        rankedTasks,
        advice: response.output_text || "No advice generated.",
    };
};

module.exports = { generateAdvice, scoreTask };
