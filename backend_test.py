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

def test_contact_form_submission():
    """Test contact form submission with comprehensive data"""
    print("\n🔍 Testing Contact Form Submission...")
    
    # Test data as specified in the review request
    test_data = {
        "name": "John Doe",
        "email": "john@example.com", 
        "phone": "9876543210",
        "project_type": "AI/ML Project",
        "domain": "Machine Learning",
        "deadline": "2025-09-01",
        "budget": "10000-20000",
        "description": "Need an AI-powered recommendation system for e-commerce"
    }
    
    try:
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
            
            print("✅ Contact form submission passed all validations")
            return True, data["id"]
            
        else:
            print(f"❌ Contact form submission failed - status code {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ Contact form submission failed with error: {e}")
        return False, None

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

def run_comprehensive_tests():
    """Run all backend API tests"""
    print("=" * 60)
    print("🚀 STARTING TECHYHIVE BACKEND API TESTS")
    print("=" * 60)
    
    test_results = []
    submission_id = None
    
    # Test 1: Health Check
    health_result = test_health_check()
    test_results.append(("Health Check", health_result))
    
    # Test 2: Contact Form Submission
    contact_result, submission_id = test_contact_form_submission()
    test_results.append(("Contact Form Submission", contact_result))
    
    # Test 3: Get All Contacts
    get_all_result = test_get_all_contacts()
    test_results.append(("Get All Contacts", get_all_result))
    
    # Test 4: Get Specific Contact
    get_specific_result = test_get_specific_contact(submission_id)
    test_results.append(("Get Specific Contact", get_specific_result))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
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
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        return True
    else:
        print(f"\n⚠️ {failed} TEST(S) FAILED. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = run_comprehensive_tests()
    sys.exit(0 if success else 1)