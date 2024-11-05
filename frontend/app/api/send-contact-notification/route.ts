import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, userId } = body;

    // Verify SMTP connection silently
    await transporter.verify();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `Support Request from ${name}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>User ID:</strong> ${userId || 'Not logged in'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; border-left: 4px solid #ccc; margin: 1.5em 10px; padding: 1em 10px;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true,
      message: 'Support notification sent successfully'
    });

  } catch (err) {
    const error = err as Error;
    // Only log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Email sending failed:', error.message);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to send notification'
      },
      { status: 500 }
    );
  }
}