import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from pathlib import Path

# Load .env from project root (parent of backend directory)
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("SMTP_USER", "amilmether.dev@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = "amilmether.dev@gmail.com"
TO_EMAIL = "amilmether.dev@gmail.com"

# Debug: Print configuration (without password)
print(f"Email Config - SMTP_USER: {SMTP_USER}")
print(f"Email Config - Password set: {'Yes' if SMTP_PASSWORD else 'No'}")
print(f"Email Config - Password length: {len(SMTP_PASSWORD) if SMTP_PASSWORD else 0}")

def send_contact_email(name: str, email: str, message_type: str, budget: str, whatsapp: str, message: str):
    """Send contact form submission via Gmail SMTP"""
    
    if not SMTP_PASSWORD:
        print("Warning: SMTP_PASSWORD not set. Email not sent.")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"New Contact Form Submission - {message_type}"
        msg["From"] = FROM_EMAIL
        msg["To"] = TO_EMAIL
        msg["Reply-To"] = email
        
        # Create HTML body
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 10px 0;">
                            <strong>Name:</strong> {name}
                        </p>
                        <p style="margin: 10px 0;">
                            <strong>Email:</strong> <a href="mailto:{email}">{email}</a>
                        </p>
                        <p style="margin: 10px 0;">
                            <strong>Type:</strong> {message_type}
                        </p>
                        <p style="margin: 10px 0;">
                            <strong>Budget:</strong> {budget if budget else 'Not specified'}
                        </p>
                        <p style="margin: 10px 0;">
                            <strong>WhatsApp:</strong> {whatsapp if whatsapp else 'Not provided'}
                        </p>
                    </div>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 5px;">
                        <h3 style="margin-top: 0; color: #000;">Message:</h3>
                        <p style="white-space: pre-wrap;">{message}</p>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #e8e8e8; border-radius: 5px; font-size: 12px; color: #666;">
                        <p style="margin: 5px 0;">This email was sent from your portfolio contact form.</p>
                        <p style="margin: 5px 0;">Reply directly to this email to respond to {name}.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        # Create plain text version
        text = f"""
New Contact Form Submission

Name: {name}
Email: {email}
Type: {message_type}
Budget: {budget if budget else 'Not specified'}
WhatsApp: {whatsapp if whatsapp else 'Not provided'}

Message:
{message}

---
This email was sent from your portfolio contact form.
Reply to: {email}
        """
        
        # Attach both versions
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"Email sent successfully to {TO_EMAIL}")
        return True
        
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False
