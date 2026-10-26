require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID, 
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"FluxCore-Backend" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


async function sendRegisterationEmail(userEmail, name) {
    const subject = 'Welcome to FluxCore-Backend!';
    const text = `Hello ${name},\n\nThank you for registering with FluxCore-Backend! We're excited to have you on board.\n\nBest regards,\nThe FluxCore-Backend Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering with <strong>FluxCore-Backend</strong>! We're excited to have you on board.</p><p>Best regards,<br>The FluxCore-Backend Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendLoginEmail(userEmail, name) {
    const subject = 'New Login to Your FluxCore-Backend Account';

    const text = `Hello ${name},

We noticed a new login to your FluxCore-Backend account.

If this was you, no further action is needed.

If you don't recognize this activity, please secure your account immediately by changing your password.

Best regards,
The FluxCore-Backend Team`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">New Login Notification</h2>
            <p>Hello ${name},</p>
            <p>We noticed a new login to your <strong>FluxCore-Backend</strong> account.</p>
            <p>If this was you, no further action is needed.</p>
            <p>If you don't recognize this activity, please secure your account immediately by changing your password.</p>
            <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The FluxCore-Backend Team</strong>
            </p>
        </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}


module.exports = { sendRegisterationEmail, sendLoginEmail , sendEmail};