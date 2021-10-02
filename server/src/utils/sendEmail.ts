import nodemailer from 'nodemailer';

export async function sendMail(to: string, html: string) {
  // const testAccount = await nodemailer.createTestAccount({});
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: '<foo@example.com>',
    to: to,
    subject: 'Quên mật khẩu',
    html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
