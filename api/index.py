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

# Import email service
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
from email_service import email_service

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

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
