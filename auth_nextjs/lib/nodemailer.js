import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // test email from https://ethereal.email/
    // test email from mailtrap

    host: 'sandbox.smtp.mailtrap.io', //'smtp.ethereal.email', 
    port: 2525, //587, 
    auth: {
        user: process.env.user_mailtrap, //process.env.user_ethereal_email, 
        pass:  process.env.pass_mailtrap //process.env.pass_ethereal_email 
    }
});

export default transporter;
