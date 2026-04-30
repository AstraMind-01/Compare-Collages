import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  // LOG THE LINK FOR DEVELOPMENT (So you don't need real SMTP to test)
  console.log('--------------------------------------------------');
  console.log(`VERIFICATION LINK FOR ${email}:`);
  console.log(verificationLink);
  console.log('--------------------------------------------------');

  // If SMTP credentials are provided, send the actual email
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"CollegesHub" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify your email for CollegesHub',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px;">
          <h2 style="color: #2563eb;">Welcome to CollegesHub!</h2>
          <p>Thank you for signing up. Please click the button below to verify your email address and activate your account.</p>
          <a href="${verificationLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Verify Email</a>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #2563eb; font-size: 12px;">${verificationLink}</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Actual verification email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send actual email, but fallback link is above.', error);
    }
  }
};
