const cron = require("node-cron");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const { sendEmail } = require("./emailService");

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

const sendUpcomingDeadlineReminders = async () => {
    if (mongoose.connection.readyState !== 1) {
        return;
    }

    const now = new Date();
    const upper = new Date(now.getTime() + FOUR_HOURS_MS);

    const tasks = await Task.find({
        deletedAt: null,
        reminderSent: false,
        status: { $ne: "Completed" },
        dueDate: { $gte: now, $lte: upper },
    }).populate("assignedTo", "name email");

    for (const task of tasks) {
        for (const assignee of task.assignedTo || []) {
            await sendEmail({
                to: assignee.email,
                subject: `Task Reminder: ${task.title}`,
                html: `<p>Task <b>${task.title}</b> is due in less than 4 hours.</p>
                       <p>Priority: ${task.priority}</p>
                       <p>Due: ${new Date(task.dueDate).toLocaleString()}</p>
                       <p>Open dashboard to update status.</p>`,
            });
        }
        task.reminderSent = true;
        await task.save();
    }
};

const startReminderJob = () => {
    cron.schedule("*/5 * * * *", async () => {
        try {
            await sendUpcomingDeadlineReminders();
        } catch (e) {
            console.error("Reminder job failed:", e.message);
        }
    });
};

module.exports = { startReminderJob, sendUpcomingDeadlineReminders };
