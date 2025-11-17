import asyncio
import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / 'backend'
sys.path.insert(0, str(backend_path))

# Load environment variables from backend directory
from dotenv import load_dotenv
load_dotenv(backend_path / '.env')

from email_service import EmailService

async def test_email_service():
    print("Testing Email Service Configuration...")
    
    # Check environment variables
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    smtp_from = os.environ.get('SMTP_FROM_EMAIL')
    
    print(f"SMTP_USER: {smtp_user}")
    print(f"SMTP_PASSWORD: {'*' * len(smtp_password) if smtp_password else 'Not Set'}")
    print(f"SMTP_FROM_EMAIL: {smtp_from}")
    
    if not all([smtp_user, smtp_password, smtp_from]):
        print("❌ Missing required environment variables!")
        return
    
    # Initialize email service
    email_service = EmailService()
    
    # Test sending email
    print("\n📧 Sending test email...")
    
    test_contact_data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'project_type': 'Web Development',
        'description': 'This is a test email'
    }
    
    # Send admin notification
    admin_html = email_service.get_admin_notification_template(test_contact_data)
    admin_result = await email_service.send_email(
        to_email=smtp_user,  # Send to same email
        subject="🔔 Test Contact Form Submission",
        html_content=admin_html
    )
    
    print(f"Admin email result: {'✅ Success' if admin_result else '❌ Failed'}")
    
    # Send user confirmation
    user_html = email_service.get_user_confirmation_template('Test User')
    user_result = await email_service.send_email(
        to_email=smtp_user,  # Send to same email for testing
        subject="✅ Test Confirmation - TechyHive",
        html_content=user_html
    )
    
    print(f"User email result: {'✅ Success' if user_result else '❌ Failed'}")

if __name__ == "__main__":
    asyncio.run(test_email_service())