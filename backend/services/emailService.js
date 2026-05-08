const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.SMTP_HOST) {
        return;
    }

    await getTransporter().sendMail({
        from: process.env.EMAIL_FROM || "Task Forge <no-reply@taskforge.app>",
        to,
        subject,
        html,
    });
};

module.exports = { sendEmail };
