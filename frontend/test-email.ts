import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';

// Load environment variables from .env file
const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
if (result.error) {
    console.error('Error loading .env:', result.error);
}

async function main() {
    console.log('Testing email configuration...');
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASSWORD type:', typeof process.env.SMTP_PASSWORD);
    console.log('SMTP_PASSWORD length:', process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.length : 0);
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
    console.log('SMTP_SECURE:', process.env.SMTP_SECURE || 'false (default)');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.error('❌ Missing SMTP_USER or SMTP_PASSWORD in .env file');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        console.log('Verifying transporter...');
        await transporter.verify();
        console.log('✅ Transporter verified successfully');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to self
            subject: 'Test Email from Debug Script',
            text: 'If you receive this, the email configuration is working correctly.',
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error(error);
    }
}

main();
