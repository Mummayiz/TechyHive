from fastapi import FastAPI, APIRouter, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import os
import logging
import uuid
from datetime import datetime, timezone
import asyncio

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Inline EmailService to avoid import issues in Vercel
import httpx

class EmailService:
    def __init__(self):
        self.sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
        self.from_email = os.environ.get('SMTP_FROM_EMAIL', 'techyhive03@gmail.com')
        self.from_name = os.environ.get('SMTP_FROM_NAME', 'TechyHive')

    async def send_email(self, to_email: str, subject: str, html_content: str):
        """Send an email using SendGrid API"""
        try:
            if not self.sendgrid_api_key:
                logger.error("SendGrid API key not configured")
                return False

            url = "https://api.sendgrid.com/v3/mail/send"
            headers = {
                "Authorization": f"Bearer {self.sendgrid_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "personalizations": [
                    {
                        "to": [{"email": to_email}],
                        "subject": subject
                    }
                ],
                "from": {
                    "email": self.from_email,
                    "name": self.from_name
                },
                "content": [
                    {
                        "type": "text/html",
                        "value": html_content
                    }
                ]
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers)
                
                if response.status_code == 202:
                    logger.info(f"Email sent successfully to {to_email}")
                    return True
                else:
                    logger.error(f"Failed to send email to {to_email}: Status {response.status_code}, Response: {response.text}")
                    return False
                    
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    def get_admin_notification_template(self, contact_data: dict) -> str:
        """HTML template for admin notification"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f8fafc;
                    padding: 30px;
                    border: 1px solid #e2e8f0;
                }}
                .field {{
                    margin-bottom: 20px;
                    padding: 15px;
                    background: white;
                    border-left: 4px solid #f97316;
                    border-radius: 4px;
                }}
                .field-label {{
                    font-weight: bold;
                    color: #f97316;
                    font-size: 12px;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }}
                .field-value {{
                    color: #1e293b;
                    font-size: 16px;
                }}
                .footer {{
                    text-align: center;
                    padding: 20px;
                    color: #64748b;
                    font-size: 12px;
                    border-top: 1px solid #e2e8f0;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 New Contact Form Submission</h1>
            </div>
            <div class="content">
                <p>You have received a new contact form submission from your TechyHive website:</p>
                
                <div class="field">
                    <div class="field-label">Name</div>
                    <div class="field-value">{contact_data.get('name', 'N/A')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Email</div>
                    <div class="field-value">{contact_data.get('email', 'N/A')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Phone</div>
                    <div class="field-value">{contact_data.get('phone', 'Not provided')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Project Type</div>
                    <div class="field-value">{contact_data.get('project_type', 'N/A')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Domain</div>
                    <div class="field-value">{contact_data.get('domain', 'Not provided')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Deadline</div>
                    <div class="field-value">{contact_data.get('deadline', 'Not provided')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Budget</div>
                    <div class="field-value">{contact_data.get('budget', 'Not provided')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Description</div>
                    <div class="field-value">{contact_data.get('description', 'N/A')}</div>
                </div>
            </div>
            <div class="footer">
                <p>This email was sent from your TechyHive contact form system</p>
                <p>&copy; 2025 TechyHive. All rights reserved.</p>
            </div>
        </body>
        </html>
        """

    def get_user_confirmation_template(self, name: str) -> str:
        """HTML template for user confirmation"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                }}
                .content {{
                    background: #f8fafc;
                    padding: 40px;
                    border: 1px solid #e2e8f0;
                }}
                .message-box {{
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    border-left: 4px solid #f97316;
                    margin: 20px 0;
                }}
                .checkmark {{
                    width: 60px;
                    height: 60px;
                    background: #10b981;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 32px;
                }}
                .highlight {{
                    color: #f97316;
                    font-weight: bold;
                }}
                .footer {{
                    text-align: center;
                    padding: 30px;
                    color: #64748b;
                    font-size: 14px;
                    border-top: 1px solid #e2e8f0;
                }}
                .social-links {{
                    margin-top: 20px;
                }}
                .social-links a {{
                    color: #f97316;
                    text-decoration: none;
                    margin: 0 10px;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>✨ Thank You for Reaching Out!</h1>
            </div>
            <div class="content">
                <div class="checkmark">✓</div>
                
                <h2 style="text-align: center; color: #1e293b;">We've Received Your Request!</h2>
                
                <div class="message-box">
                    <p>Hi <span class="highlight">{name}</span>,</p>
                    
                    <p>Thank you for contacting <strong>TechyHive</strong>! We're excited to learn about your project and how we can help bring your vision to life.</p>
                    
                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>Our team will review your request carefully</li>
                        <li>We'll get back to you within <span class="highlight">24 hours</span></li>
                        <li>We'll discuss your project details and provide a tailored solution</li>
                    </ul>
                    
                    <p>In the meantime, feel free to check out our portfolio and latest projects on our website and Instagram!</p>
                </div>
                
                <p style="text-align: center; margin-top: 30px;">
                    <strong>Need urgent assistance?</strong><br>
                    <span style="color: #f97316; font-size: 18px;">📧 techyhive03@gmail.com</span>
                </p>
            </div>
            <div class="footer">
                <p><strong>TechyHive</strong> - Transforming Ideas into Digital Reality</p>
                <div class="social-links">
                    <a href="https://www.instagram.com/techyhive.in">Follow us on Instagram</a>
                </div>
                <p style="margin-top: 20px;">&copy; 2025 TechyHive. All rights reserved.</p>
            </div>
        </body>
        </html>
        """

# Create a singleton instance
email_service = EmailService()

# Create the main app
app = FastAPI()

# Create a router WITHOUT /api prefix (Vercel routing already handles this)
api_router = APIRouter()

# Define Models
class ContactSubmissionCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    project_type: str
    domain: str = ""
    deadline: str = ""
    budget: str = ""
    description: str

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str = ""
    project_type: str
    domain: str = ""
    deadline: str = ""
    budget: str = ""
    description: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"

# Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/debug/env")
async def debug_env():
    """Debug endpoint to check environment variables"""
    return {
        "sendgrid_api_key": "***" if os.environ.get('SENDGRID_API_KEY') else 'NOT_SET',
        "smtp_from_email": os.environ.get('SMTP_FROM_EMAIL', 'NOT_SET'),
        "smtp_from_name": os.environ.get('SMTP_FROM_NAME', 'NOT_SET'),
    }

# Background task for sending emails
async def send_contact_emails(contact_dict: dict, contact_email: str, contact_name: str):
    """Send emails in the background without blocking the response"""
    try:
        admin_email = os.environ.get('SMTP_FROM_EMAIL', 'techyhive03@gmail.com')
        
        # Prepare email tasks
        email_tasks = []
        
        # Admin notification task
        if admin_email:
            admin_html = email_service.get_admin_notification_template(contact_dict)
            admin_task = email_service.send_email(
                to_email=admin_email,
                subject=f"🔔 New Contact Form Submission from {contact_name}",
                html_content=admin_html
            )
            email_tasks.append(('admin', admin_email, admin_task))
        
        # User confirmation task
        user_html = email_service.get_user_confirmation_template(contact_name)
        user_task = email_service.send_email(
            to_email=contact_email,
            subject="✅ We've Received Your Request - TechyHive",
            html_content=user_html
        )
        email_tasks.append(('user', contact_email, user_task))
        
        # Send all emails in parallel
        if email_tasks:
            results = await asyncio.gather(*[task for _, _, task in email_tasks], return_exceptions=True)
            
            # Log results
            for (email_type, recipient, _), result in zip(email_tasks, results):
                if isinstance(result, Exception):
                    logger.error(f"Failed to send {email_type} email to {recipient}: {str(result)}")
                elif result:
                    logger.info(f"{email_type.capitalize()} email sent to {recipient}")
                else:
                    logger.error(f"Failed to send {email_type} email to {recipient}")
    except Exception as e:
        logger.error(f"Error sending emails: {str(e)}")

# Contact Form Endpoint
@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact_submission(input: ContactSubmissionCreate, background_tasks: BackgroundTasks):
    contact_dict = input.model_dump()
    contact_obj = ContactSubmission(**contact_dict)
    
    logger.info(f"New contact submission from {contact_obj.name} ({contact_obj.email})")
    
    # Schedule emails to be sent in the background
    background_tasks.add_task(
        send_contact_emails,
        contact_dict,
        contact_obj.email,
        contact_obj.name
    )
    
    logger.info("Emails scheduled for background sending")
    
    # Return immediately without waiting for emails
    return contact_obj

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://techyhivewebsite.vercel.app",
        "https://techyhive.in", 
        "https://www.techyhive.in",
        "http://localhost:3000",
        "*"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router in the main app
app.include_router(api_router)

# Export for Vercel
handler = app
