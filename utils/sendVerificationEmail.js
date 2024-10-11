const nodemailer = require('nodemailer');

exports.sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Click this link to verify your email: http://localhost:5000/api/auth/verify-email/${token}`,
    };

    await transporter.sendMail(mailOptions);
};
