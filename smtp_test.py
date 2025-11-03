#!/usr/bin/env python3
"""
Simple SMTP test to diagnose Gmail authentication issues
"""

import asyncio
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

async def test_smtp_connection():
    """Test SMTP connection and authentication"""
    
    smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    print(f"Testing SMTP connection to {smtp_host}:{smtp_port}")
    print(f"Username: {smtp_user}")
    print(f"Password length: {len(smtp_password) if smtp_password else 0}")
    print(f"Password: {smtp_password[:4]}...{smtp_password[-4:] if len(smtp_password) > 8 else smtp_password}")
    
    try:
        # Create a simple test message
        message = MIMEMultipart('alternative')
        message['Subject'] = "SMTP Test"
        message['From'] = f"TechyHive <{smtp_user}>"
        message['To'] = smtp_user  # Send to self for testing
        
        text_part = MIMEText("This is a test email to verify SMTP configuration.", 'plain')
        message.attach(text_part)
        
        print("\nAttempting to send test email...")
        
        # Try to send the email
        await aiosmtplib.send(
            message,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_user,
            password=smtp_password,
            start_tls=True,
        )
        
        print("✅ SMTP test successful! Email sent.")
        return True
        
    except Exception as e:
        print(f"❌ SMTP test failed: {str(e)}")
        
        # Check for specific error types
        if "530" in str(e) and "Authentication Required" in str(e):
            print("\n🔍 Diagnosis: Gmail SMTP Authentication Error")
            print("Possible causes:")
            print("1. App password is incorrect or expired")
            print("2. 2-Step Verification is not enabled on the Gmail account")
            print("3. App passwords are disabled by organization (if using Google Workspace)")
            print("4. The Gmail account has security restrictions")
            print("\nRecommended actions:")
            print("- Verify 2-Step Verification is enabled")
            print("- Generate a new app password")
            print("- Check if account is Google Workspace with admin restrictions")
        
        return False

if __name__ == "__main__":
    success = asyncio.run(test_smtp_connection())
    exit(0 if success else 1)