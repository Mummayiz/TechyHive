from fastapi import FastAPI, APIRouter, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import asyncio

# Configure logging FIRST
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from email_service import email_service

# MongoDB connection with error handling
try:
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=500)  # Reduced to 500ms
    db = client[os.environ.get('DB_NAME', 'techyhive')]
    logger.info(f"MongoDB connection configured for: {mongo_url}")
except Exception as e:
    logger.error(f"MongoDB connection error: {e}")
    client = None
    db = None

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

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
    status: str = "pending"  # pending, contacted, completed

class ContactSubmissionCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    project_type: str
    domain: str = ""
    deadline: str = ""
    budget: str = ""
    description: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Background task for sending emails
async def send_contact_emails(contact_dict: dict, contact_email: str, contact_name: str):
    """Send emails in the background without blocking the response"""
    try:
        admin_email = os.environ.get('SMTP_USER')
        
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

# Contact Form Endpoints
@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact_submission(input: ContactSubmissionCreate, background_tasks: BackgroundTasks):
    contact_dict = input.model_dump()
    contact_obj = ContactSubmission(**contact_dict)
    
    logger.info(f"New contact submission from {contact_obj.name} ({contact_obj.email})")
    
    # Save to MongoDB if available (non-blocking)
    if db is not None:
        try:
            doc = contact_obj.model_dump()
            doc['timestamp'] = doc['timestamp'].isoformat()
            _ = await db.contact_submissions.insert_one(doc)
            logger.info("Contact submission saved to MongoDB")
        except Exception as e:
            logger.error(f"MongoDB save error: {e}")
    else:
        logger.warning("MongoDB not available, skipping database save")
    
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

@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions():
    # Exclude MongoDB's _id field from the query results
    submissions = await db.contact_submissions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for submission in submissions:
        if isinstance(submission['timestamp'], str):
            submission['timestamp'] = datetime.fromisoformat(submission['timestamp'])
    
    return submissions

@api_router.get("/contact/{submission_id}", response_model=ContactSubmission)
async def get_contact_submission(submission_id: str):
    submission = await db.contact_submissions.find_one({"id": submission_id}, {"_id": 0})
    if submission:
        if isinstance(submission['timestamp'], str):
            submission['timestamp'] = datetime.fromisoformat(submission['timestamp'])
        return submission
    return {"error": "Submission not found"}

# Add CORS middleware BEFORE including routes
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client is not None:
        client.close()
        logger.info("MongoDB connection closed")