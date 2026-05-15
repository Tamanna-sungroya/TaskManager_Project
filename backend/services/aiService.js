const OpenAI = require("openai");

const getOpenRouterClient = () => {
    return new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
            "X-Title": "TaskForge",
        },
    });
};

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

    if (!process.env.OPENROUTER_API_KEY) {
        return {
            rankedTasks,
            advice: `Start with "${rankedTasks[0]?.title || "your highest priority pending task"}", then batch similar medium-priority items. You are ${rankedTasks.length > 5 ? "carrying a high workload; time-blocking is recommended." : "on manageable workload."}`,
        };
    }
    
    try {
        const openRouter = getOpenRouterClient();
        const systemPrompt = "You are Forge AI Assistant. Give practical productivity advice, include concrete next 3 actions.";
        const userMessage = `User Query: ${query}\n\nYour ranked tasks (by priority and urgency):\n${JSON.stringify(rankedTasks, null, 2)}`;

        const response = await openRouter.chat.completions.create({
            model: process.env.OPENROUTER_MODEL || "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const advice = response.choices[0]?.message?.content;
        
        if (!advice) {
            throw new Error("No content in OpenRouter response");
        }

        return {
            rankedTasks,
            advice,
        };
    } catch (error) {
        console.error("OpenRouter API Error:", error.message);
        // Fallback to basic advice if API fails
        return {
            rankedTasks,
            advice: `Start with "${rankedTasks[0]?.title || "your highest priority pending task"}", then batch similar medium-priority items. You are ${rankedTasks.length > 5 ? "carrying a high workload; time-blocking is recommended." : "on manageable workload."}`,
        };
    }
};

module.exports = { generateAdvice, scoreTask };
