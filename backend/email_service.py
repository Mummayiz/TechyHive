import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.smtp_user = os.environ.get('SMTP_USER')
        self.smtp_password = os.environ.get('SMTP_PASSWORD')
        self.from_email = os.environ.get('SMTP_FROM_EMAIL')
        self.from_name = os.environ.get('SMTP_FROM_NAME', 'TechyHive')

    async def send_email(self, to_email: str, subject: str, html_content: str):
        """Send an email using Gmail SMTP"""
        try:
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = f"{self.from_name} <{self.from_email}>"
            message['To'] = to_email

            html_part = MIMEText(html_content, 'html')
            message.attach(html_part)

            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_password,
                start_tls=True,
            )
            logger.info(f"Email sent successfully to {to_email}")
            return True
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