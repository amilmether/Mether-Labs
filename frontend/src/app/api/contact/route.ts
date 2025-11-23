import dotenv from 'dotenv';
dotenv.config();

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

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Verify connection configuration
      await transporter.verify();

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

      if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.SMTP_USER,
          replyTo: body.email,
          subject: `New Contact Form Submission - ${body.type}`,
          html: htmlEmail,
        });
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
