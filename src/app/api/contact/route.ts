import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Save to database
    const message = await prisma.message.create({
      data: {
        name: body.name,
        email: body.email,
        type: body.type,
        budget: body.budget || null,
        whatsapp: body.whatsapp || null,
        message: body.message,
        timestamp: new Date(),
      },
    });

    // Debug logs
    console.log('📧 Contact API invoked');
    console.log('Request body:', body);
    console.log('SMTP config:', {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
    });

    // Configure SMTP transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false otherwise
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify transporter
    try {
      await transporter.verify();
      console.log('✅ Email transporter verified');
    } catch (verifyError) {
      console.error('❌ Transport verification failed:', verifyError);
    }

    const htmlEmail = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${body.name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
              <p style="margin: 10px 0;"><strong>Type:</strong> ${body.type}</p>
              <p style="margin: 10px 0;"><strong>Budget:</strong> ${body.budget || 'Not specified'}</p>
              <p style="margin: 10px 0;"><strong>WhatsApp:</strong> ${body.whatsapp || 'Not provided'}</p>
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #000;">Message:</h3>
              <p style="white-space: pre-wrap;">${body.message}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email if credentials are present
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      try {
        const info = await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.SMTP_USER,
          replyTo: body.email,
          subject: `New Contact Form Submission - ${body.type}`,
          html: htmlEmail,
        });
        console.log('✅ Email sent, response:', info);
      } catch (sendError) {
        console.error('❌ Failed to send email:', sendError);
      }
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
