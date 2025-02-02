import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({ 
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Increase the timeout setting
    timeout: 100000 // 10 seconds
})

export default transporter;