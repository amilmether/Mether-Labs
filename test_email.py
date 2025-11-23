#!/usr/bin/env python3
"""Test email configuration"""

import sys
import os
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / 'backend'
sys.path.insert(0, str(backend_path))

from email_utils import send_contact_email, SMTP_USER, SMTP_PASSWORD

print("=" * 50)
print("Email Configuration Test")
print("=" * 50)
print(f"SMTP User: {SMTP_USER}")
print(f"Password Set: {'Yes' if SMTP_PASSWORD else 'No'}")
print(f"Password Length: {len(SMTP_PASSWORD) if SMTP_PASSWORD else 0}")
print("=" * 50)

if not SMTP_PASSWORD:
    print("\n❌ ERROR: SMTP_PASSWORD is not set!")
    print("Please check your .env file")
    sys.exit(1)

print("\n✅ Configuration looks good!")
print("\nSending test email...")

try:
    result = send_contact_email(
        name="Test User",
        email="test@example.com",
        message_type="Test",
        budget="N/A",
        message="This is a test email from the portfolio website."
    )
    
    if result:
        print("\n✅ Test email sent successfully!")
        print(f"Check your inbox at {SMTP_USER}")
    else:
        print("\n❌ Email sending failed (check logs above)")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
