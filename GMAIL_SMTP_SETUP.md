# Gmail SMTP Setup Guide

This guide will help you set up Gmail SMTP for sending contact form emails.

## Prerequisites
- Gmail account (amilmether.dev@gmail.com)
- 2-Step Verification enabled on your Google account

## Step-by-Step Setup

### 1. Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click on "2-Step Verification"
3. Follow the prompts to enable it if not already enabled

### 2. Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. You may need to sign in again
3. In the "Select app" dropdown, choose "Mail"
4. In the "Select device" dropdown, choose "Other (Custom name)"
5. Enter a name like "Portfolio Website"
6. Click "Generate"
7. Google will show you a 16-character password (e.g., `abcd efgh ijkl mnop`)
8. **Copy this password** (you won't be able to see it again)

### 3. Configure Your Application
1. Open the `.env` file in the root directory of your project
2. Find the line `SMTP_PASSWORD=`
3. Paste your app password (remove spaces): `SMTP_PASSWORD=abcdefghijklmnop`
4. Save the file

Example `.env` file:
```
SMTP_USER=amilmether.dev@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
ANALYTICS_SALT=super_secret_salt_value
```

### 4. Restart Your Backend Server
The backend needs to be restarted to load the new environment variables:
```bash
# Stop the current backend server (Ctrl+C)
# Then restart it:
cd /home/amilmether/Code/Personal
source backend/venv/bin/activate
uvicorn backend.main:app --reload --port 8000
```

## Testing

### Test the Contact Form
1. Go to your website's contact page: `http://localhost:3000/contact`
2. Fill out the form with test data
3. Submit the form
4. Check your email at `amilmether.dev@gmail.com`
5. You should receive an email with the contact form details

### What the Email Contains
- Sender's name and email
- Message type (e.g., "Project Inquiry")
- Budget (if provided)
- The message content
- Reply-To header set to the sender's email for easy replies

## Troubleshooting

### Email not sending?
1. **Check the password**: Make sure there are no spaces in the app password
2. **Check 2-Step Verification**: It must be enabled
3. **Check the logs**: Look at your backend terminal for error messages
4. **Regenerate password**: If it still doesn't work, generate a new app password

### Common Errors

**"Authentication failed"**
- Your app password is incorrect
- Regenerate a new app password and update `.env`

**"SMTP connection failed"**
- Check your internet connection
- Gmail SMTP might be blocked by firewall

**"No module named 'dotenv'"**
- Run: `pip install python-dotenv`

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit the `.env` file to Git
- The `.env` file is already in `.gitignore`
- Never share your app password
- If compromised, revoke it immediately at [App Passwords](https://myaccount.google.com/apppasswords)

## Email Flow

1. User fills out contact form on website
2. Form data is sent to backend API (`POST /api/contact`)
3. Backend saves message to database
4. Backend sends email notification to `amilmether.dev@gmail.com`
5. You receive the email and can reply directly from your inbox

## Links Updated

The following links have been updated in your website:
- **Email**: amilmether.dev@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/amilmether/
- **GitHub**: https://github.com/amilmether/

These appear in the footer of every page.
