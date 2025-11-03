#!/usr/bin/env python3
"""
TechyHive Backend API Testing Suite
Tests the contact form backend API endpoints
"""

import requests
import json
import uuid
from datetime import datetime
import sys

# Get the backend URL from frontend .env
BACKEND_URL = "https://message-sender-16.preview.emergentagent.com/api"

def test_health_check():
    """Test the basic health check endpoint"""
    print("🔍 Testing Health Check Endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Health check passed")
                return True
            else:
                print("❌ Health check failed - unexpected response")
                return False
        else:
            print(f"❌ Health check failed - status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check failed with error: {e}")
        return False

def test_contact_form_submission_with_email():
    """Test contact form submission with email functionality"""
    print("\n🔍 Testing Contact Form Submission with Email Functionality...")
    
    # Test data as specified in the review request
    test_data = {
        "name": "John Smith",
        "email": "test@example.com",
        "phone": "+1234567890",
        "project_type": "Web Development",
        "domain": "E-commerce",
        "deadline": "2 months",
        "budget": "$5000-$10000",
        "description": "Need a modern e-commerce website with payment integration"
    }
    
    try:
        print(f"📧 Submitting contact form with email: {test_data['email']}")
        print(f"📧 Expected admin notification to: techyhive03@gmail.com")
        
        response = requests.post(
            f"{BACKEND_URL}/contact",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify all required fields are present
            required_fields = ["id", "name", "email", "phone", "project_type", 
                             "domain", "deadline", "budget", "description", 
                             "timestamp", "status"]
            
            missing_fields = []
            for field in required_fields:
                if field not in data:
                    missing_fields.append(field)
            
            if missing_fields:
                print(f"❌ Missing fields in response: {missing_fields}")
                return False, None
            
            # Verify field values match input
            for key, value in test_data.items():
                if data.get(key) != value:
                    print(f"❌ Field mismatch - {key}: expected '{value}', got '{data.get(key)}'")
                    return False, None
            
            # Verify UUID format
            try:
                uuid.UUID(data["id"])
                print("✅ ID is valid UUID format")
            except ValueError:
                print(f"❌ ID is not valid UUID format: {data['id']}")
                return False, None
            
            # Verify timestamp format
            try:
                datetime.fromisoformat(data["timestamp"].replace('Z', '+00:00'))
                print("✅ Timestamp is valid ISO format")
            except ValueError:
                print(f"❌ Timestamp is not valid ISO format: {data['timestamp']}")
                return False, None
            
            # Verify status
            if data["status"] != "pending":
                print(f"❌ Status should be 'pending', got '{data['status']}'")
                return False, None
            
            print("✅ Contact form submission API response validated successfully")
            print("📧 Email functionality will be verified through backend logs")
            return True, data["id"]
            
        else:
            print(f"❌ Contact form submission failed - status code {response.status_code}")
            try:
                error_detail = response.json()
                print(f"Error details: {error_detail}")
            except:
                print(f"Response text: {response.text}")
            return False, None
            
    except Exception as e:
        print(f"❌ Contact form submission failed with error: {e}")
        return False, None

def check_backend_logs_for_email_confirmation():
    """Check backend logs for email sending confirmation messages"""
    print("\n🔍 Checking Backend Logs for Email Confirmation...")
    
    try:
        import subprocess
        
        # Check supervisor backend logs for email confirmation messages
        result = subprocess.run(
            ["tail", "-n", "50", "/var/log/supervisor/backend.err.log"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            log_content = result.stdout
            print("📋 Recent backend logs:")
            print("-" * 40)
            print(log_content[-1000:])  # Show last 1000 characters
            print("-" * 40)
            
            # Check for email confirmation messages
            admin_email_sent = "Admin notification sent to techyhive03@gmail.com" in log_content
            user_email_sent = "Confirmation email sent to" in log_content
            
            # Check for email failure messages
            admin_email_failed = "Failed to send admin notification to techyhive03@gmail.com" in log_content
            user_email_failed = "Failed to send confirmation email to" in log_content
            
            if admin_email_sent:
                print("✅ Found admin notification email confirmation in logs")
            elif admin_email_failed:
                print("❌ Admin notification email FAILED - found failure message in logs")
            else:
                print("❌ No admin notification email status found in logs")
            
            if user_email_sent:
                print("✅ Found user confirmation email confirmation in logs")
            elif user_email_failed:
                print("❌ User confirmation email FAILED - found failure message in logs")
            else:
                print("❌ No user confirmation email status found in logs")
            
            # Check for specific email errors
            email_errors = []
            if "530, '5.7.0 Authentication Required" in log_content:
                print("🔍 Found Gmail authentication error - SMTP credentials issue")
                email_errors.append("Gmail SMTP authentication failed")
            
            if "Error sending emails:" in log_content:
                print("⚠️ Found general email sending errors in logs")
                email_errors.append("General email sending error found")
            
            if "Failed to send email" in log_content:
                print("⚠️ Found specific email failure messages in logs")
                email_errors.append("Specific email failures found")
            
            # Email is working if we see success messages, not working if we see failure messages
            email_working = (admin_email_sent and user_email_sent) and not (admin_email_failed or user_email_failed)
            return email_working, email_errors
            
        else:
            print(f"❌ Failed to read backend logs: {result.stderr}")
            return False, ["Could not read backend logs"]
            
    except subprocess.TimeoutExpired:
        print("❌ Timeout while reading backend logs")
        return False, ["Timeout reading logs"]
    except Exception as e:
        print(f"❌ Error checking backend logs: {e}")
        return False, [f"Error: {e}"]

def test_get_all_contacts():
    """Test retrieving all contact submissions"""
    print("\n🔍 Testing Get All Contact Submissions...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/contact")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of submissions retrieved: {len(data)}")
            
            if len(data) > 0:
                # Verify structure of first submission
                first_submission = data[0]
                required_fields = ["id", "name", "email", "timestamp", "status"]
                
                missing_fields = []
                for field in required_fields:
                    if field not in first_submission:
                        missing_fields.append(field)
                
                if missing_fields:
                    print(f"❌ Missing fields in submission: {missing_fields}")
                    return False
                
                print("✅ Get all contacts passed")
                return True
            else:
                print("⚠️ No submissions found (this might be expected if database is empty)")
                return True
                
        else:
            print(f"❌ Get all contacts failed - status code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Get all contacts failed with error: {e}")
        return False

def test_get_specific_contact(submission_id):
    """Test retrieving a specific contact submission by ID"""
    print(f"\n🔍 Testing Get Specific Contact Submission (ID: {submission_id})...")
    
    if not submission_id:
        print("⚠️ Skipping specific contact test - no submission ID available")
        return True
    
    try:
        response = requests.get(f"{BACKEND_URL}/contact/{submission_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify the ID matches
            if data.get("id") == submission_id:
                print("✅ Get specific contact passed")
                return True
            else:
                print(f"❌ ID mismatch - expected {submission_id}, got {data.get('id')}")
                return False
                
        else:
            print(f"❌ Get specific contact failed - status code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Get specific contact failed with error: {e}")
        return False

def run_email_focused_tests():
    """Run email-focused backend API tests"""
    print("=" * 70)
    print("📧 STARTING TECHYHIVE EMAIL FUNCTIONALITY TESTS")
    print("=" * 70)
    
    test_results = []
    submission_id = None
    email_errors = []
    
    # Test 1: Health Check (basic connectivity)
    health_result = test_health_check()
    test_results.append(("Health Check", health_result))
    
    # Test 2: Contact Form Submission with Email
    contact_result, submission_id = test_contact_form_submission_with_email()
    test_results.append(("Contact Form Submission with Email", contact_result))
    
    # Test 3: Check Backend Logs for Email Confirmation
    if contact_result:
        print("\n⏳ Waiting 3 seconds for email processing...")
        import time
        time.sleep(3)
        
        email_logs_result, errors = check_backend_logs_for_email_confirmation()
        test_results.append(("Email Confirmation in Logs", email_logs_result))
        email_errors.extend(errors)
    else:
        print("⚠️ Skipping email log check due to failed contact submission")
        test_results.append(("Email Confirmation in Logs", False))
        email_errors.append("Contact submission failed")
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 EMAIL FUNCTIONALITY TEST RESULTS")
    print("=" * 70)
    
    passed = 0
    failed = 0
    
    for test_name, result in test_results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal Tests: {len(test_results)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    # Show email errors if any
    if email_errors:
        print(f"\n⚠️ EMAIL ISSUES DETECTED:")
        for error in email_errors:
            print(f"  • {error}")
    
    # Email-specific summary
    email_working = any("Email Confirmation" in name and result for name, result in test_results)
    api_working = any("Contact Form Submission" in name and result for name, result in test_results)
    
    print(f"\n📧 EMAIL FUNCTIONALITY STATUS:")
    print(f"  • API Response: {'✅ Working' if api_working else '❌ Failed'}")
    print(f"  • Email Sending: {'✅ Working' if email_working else '❌ Failed'}")
    
    if failed == 0:
        print("\n🎉 ALL EMAIL TESTS PASSED! Email functionality is working correctly.")
        print("📧 Both admin notification and user confirmation emails should be sent.")
        return True
    else:
        print(f"\n⚠️ {failed} TEST(S) FAILED. Email functionality needs attention.")
        return False

if __name__ == "__main__":
    success = run_email_focused_tests()
    sys.exit(0 if success else 1)