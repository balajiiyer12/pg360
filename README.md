
PG 360 - Solution Design & Technical Documentation
Project Information

Project Name: PG 360
 Project Type: Web Application
 Developer: Balaji Iyer
 Manager: Mayank Garkoti
 Guide/Mentor: Deep Shah
 Project Nature: Individual Project
 Document Type: Solution Design & Technical Documentation

1. Executive Summary

PG 360 is a web-based Paying Guest (PG) and Hostel Management System developed to simplify the administration of hostels and PG accommodations. The application provides a centralized platform for managing hostels, rooms, tenants, occupancy, and complaints.

Traditionally, PG owners maintained records manually, making it difficult to track tenant information, room occupancy, vacancies, and complaints. As the number of hostels increased, managing operations became increasingly complex and time-consuming.

PG 360 digitizes these processes, enabling PG owners to efficiently manage multiple hostels while providing tenants with a platform to raise and track complaints online.

2. Business Problem Statement
Existing Challenges

Before PG 360:

Tenant records were maintained manually.
Room occupancy and vacancies were tracked using spreadsheets or paper records.
Complaint management lacked visibility and traceability.
Managing multiple hostels required significant manual effort.
Information was scattered and difficult to maintain.
Operational efficiency decreased as the business scaled.
Need for the Solution

A centralized digital solution was required to:

Reduce administrative overhead.
Improve transparency.
Maintain accurate occupancy information.
Enable online complaint management.
Support management of multiple hostels.
3. Project Objectives
Objective 1: Reduce Manual Effort

Digitize hostel operations and eliminate dependency on manual record keeping.

Objective 2: Improve Transparency

Provide visibility into occupancy, room allocation, tenant details, and complaint status.

Objective 3: Centralized Hostel Management

Allow administrators to manage multiple hostels through a single platform.

Objective 4: Improve Complaint Resolution

Enable structured complaint management and status tracking.

4. Scope of the Project
In Scope
User Authentication
Hostel Management
Room Management
Tenant Management
Tenant Assignment/De-assignment
Complaint Management
Occupancy Tracking
Role-Based Access Control
Out of Scope
Online Payment Gateway
KYC Verification
Mobile Application
Third-Party Integrations
5. Functional Requirements
Module 1: Authentication
Description

Provides secure access control to the platform.

Features
Login functionality
JWT-based authentication
Role-based authorization
Admin-managed account creation
No public signup access
Module 2: Hostel Management
Description

Allows administrators to manage hostels.

Functionalities
Create Hostel
View Hostel Details
Update Hostel
Delete Hostel
Manage Multiple Hostels
Module 3: Room Management
Description

Allows room creation and occupancy management.

Functionalities
Create Room
View Rooms
Edit Room Details
Delete Room
Set Capacity
Set Rent
Track Occupancy
Module 4: Tenant Management
Description

Allows management of tenants and room allocation.

Functionalities
Create Tenant
View Tenant Details
Update Tenant Information
Delete Tenant
Assign Tenant to Room
Remove Tenant From Room
Module 5: Complaint Management
Description

Allows tenants to register complaints digitally.

Functionalities
Create Complaint
View Complaints
Delete Complaint
Track Status
Module 6: Complaint Resolution
Description

Allows administrators to handle complaints.

Functionalities
View Complaints
Update Complaint Status
Mark as Pending
Mark as Resolved
Delete Complaint
6. System Architecture
High-Level Architecture
+------------+
|    User    |
+------------+
      |
      V
+----------------+
| React Frontend |
+----------------+
      |
      V
+----------------+
| Express Backend|
+----------------+
      |
      V
+----------------+
| PostgreSQL DB  |
+----------------+

Deployment Architecture
Frontend
React + Vite
      |
      V
Google Cloud Storage Bucket

Backend
Express.js API
      |
      V
Google Cloud Compute Engine

Database
PostgreSQL
      |
      V
Neon Database

7. Technology Stack
Frontend
React JS
Vite
JavaScript
Context API
Axios
Responsibilities
User Interface
State Management
API Communication
Route Management
Backend
Express JS
Drizzle ORM
JWT Authentication
Cookie Parser
CORS
Responsibilities
Business Logic
API Services
Authentication & Authorization
Database Operations
Database
PostgreSQL
Neon Database
Cloud Platform
Frontend Hosting
Google Cloud Storage Bucket
Backend Hosting
Google Cloud Compute Engine
8. Backend Application Design
Backend Overview

The backend is developed using Express.js and follows a RESTful architecture.

Key responsibilities include:

User Management
Hostel Management
Room Management
Complaint Management
Authentication
Authorization
Database Connectivity
Application Startup Flow
Server Startup
      |
      V
Connect to PostgreSQL Database
      |
      V
Initialize Express Application
      |
      V
Load Middleware
      |
      V
Register Routes
      |
      V
Start Server (Port 8080)

Middleware Configuration
CORS

Allows communication between frontend and backend applications.

Cookie Parser

Parses authentication cookies.

Express JSON

Handles incoming JSON requests.

Authentication Middleware

Verifies JWT tokens.

Authorization Middleware

Provides role-based access control.

9. Application Route Structure
Primary API Routes
/api/auth
/api/admin/users
/api/admin/hostel
/api/complaints/admin
/api/complaints/tenant

10. Authentication Module Design
Base Route
/api/auth

APIs
Login
POST /api/auth/login


Authenticates users and issues JWT tokens.

Logout
POST /api/auth/logout


Logs users out of the application.

Get Logged-In User
GET /api/auth/me


Returns current authenticated user information.

Create User
POST /api/auth/signup


Creates a new account.

11. User Management APIs
Base Route
/api/admin/users

Access

Admin Only

Create User
POST /api/admin/users

Get Hostel Tenants
GET /api/admin/users/hostel/:hostelid

Update User
PUT /api/admin/users/:userid

Delete User
DELETE /api/admin/users/:userid

12. Hostel Management APIs
Base Route
/api/admin/hostel

Access

Admin Only

Get Dashboard Statistics
GET /api/admin/hostel/stats

Get All Hostels
GET /api/admin/hostel

Create Hostel
POST /api/admin/hostel

Get Hostel By ID
GET /api/admin/hostel/:hostelid

Update Hostel
PUT /api/admin/hostel/:hostelid

Delete Hostel
DELETE /api/admin/hostel/:hostelid

13. Room Management APIs
Create Room
POST /api/admin/hostel/:hostelid/room

Stores
Room Name
Capacity
Rent
Hostel Reference
Get Rooms
GET /api/admin/hostel/:hostelid/room

Update Room
PUT /api/admin/hostel/rooms/:roomid

Delete Room
DELETE /api/admin/hostel/rooms/:roomid

14. Complaint Management APIs
Tenant Complaint APIs
Base Route
/api/complaints/tenant

Access

Tenant Only

View My Complaints
GET /api/complaints/tenant

Raise Complaint
POST /api/complaints/tenant

Delete Complaint
DELETE /api/complaints/tenant/:complaintid

Admin Complaint APIs
Base Route
/api/complaints/admin

Access

Admin Only

View All Complaints
GET /api/complaints/admin

View Hostel Complaints
GET /api/complaints/admin/hostel/:hostelid

Update Complaint Status
PATCH /api/complaints/admin/:complaintid

Delete Complaint
DELETE /api/complaints/admin/:complaintid

15. Database Design
ENUM Definitions
User Roles
ADMIN
TENANT
DEFAULT

Complaint Status
PENDING
RESOLVED

Users Table
Purpose

Stores user and tenant information.

Fields
id
name
role
email
password
hostelId
roomId

Hostels Table
Purpose

Stores hostel information.

Fields
hostelId
name
ownerId
description

Rooms Table
Purpose

Stores room details.

Fields
roomId
hostelId
capacity
rent
roomName

Complaints Table
Purpose

Stores tenant complaints.

Fields
complaintId
authorId
hostelId
title
description
status
createdAt
updatedAt

16. Entity Relationship Diagram
Users
  |
  | ownerId
  |
Hostels
  |
  | hostelId
  |
Rooms

Users
  |
  | roomId
  |
Rooms

Users
  |
  | authorId
  |
Complaints

Hostels
  |
  | hostelId
  |
Complaints

17. Security Design
Authentication Mechanism

JWT-Based Authentication

Authentication Flow
User Login
     |
     V
Credential Validation
     |
     V
JWT Token Generation
     |
     V
Token Issued
     |
     V
Protected Resource Access

Authorization Mechanism

Role-Based Access Control (RBAC)

Roles
Admin

Permissions:

Manage Hostels
Manage Rooms
Manage Tenants
View Complaints
Update Complaint Status
Dashboard Access
Tenant

Permissions:

Login
View Assigned Information
Create Complaints
View Complaint History
Security Middleware
protect Middleware
JWT Validation
User Verification
Route Protection
isAdmin Middleware

Restricts access to Admin-only resources.

isTenant Middleware

Restricts access to Tenant-only resources.

18. Application Workflows
Hostel Management Workflow
Admin Login
      |
      V
Create Hostel
      |
      V
Create Rooms
      |
      V
Register Tenants
      |
      V
Assign Rooms
      |
      V
Track Occupancy

Complaint Management Workflow
Tenant Login
      |
      V
Raise Complaint
      |
      V
Complaint Stored
      |
      V
Admin Reviews Complaint
      |
      V
Update Status
(Pending / Resolved)

19. Testing Strategy
Manual Testing

The application was manually tested throughout development.

Areas Tested
Login
Authentication
Hostel CRUD Operations
Room CRUD Operations
User CRUD Operations
Room Assignment
Complaint Management
Authorization
API Testing
Tool Used

Postman

Test Coverage
Request Validation
Response Validation
JWT Validation
CRUD Operations
Error Scenarios
Authorization Checks
20. Deployment Strategy
Frontend Deployment
Platform

Google Cloud Storage Bucket

Steps
Generate Vite Production Build
Upload Build Files
Configure Static Hosting
Verify Deployment
Backend Deployment
Platform

Google Cloud Compute Engine

Steps
Deploy Node.js Application
Configure Environment Variables
Start Application Service
Configure Networking Rules
Database Deployment
Platform

Neon PostgreSQL

Activities
Database Configuration
Schema Migration
ORM Setup
Connection Management
21. Challenges Faced
Challenge 1: Multi-Hostel Relationship Management

Managing hostels, rooms, tenants, and complaints while maintaining relational integrity.

Resolution

Designed a normalized PostgreSQL schema using foreign key relationships and Drizzle ORM mappings.

Challenge 2: Room Assignment Logic

Preventing invalid room allocations and maintaining occupancy data.

Resolution

Implemented room assignment and de-assignment workflows using relational references.

Challenge 3: Secure Access Control

Ensuring only authorized users could access sensitive resources.

Resolution

Implemented JWT authentication along with role-based authorization middleware.

22. Business Benefits
Benefits for PG Owners
Centralized hostel management
Better occupancy tracking
Reduced paperwork
Faster complaint handling
Easier tenant management
Support for multiple hostels
Benefits for Tenants
Online complaint registration
Complaint tracking
Increased transparency
Faster issue resolution
Organizational Benefits
Reduced operational effort
Improved record accuracy
Better visibility into hostel operations
Scalable management framework
23. Future Enhancements
Online Payment Management
Rent Collection
Payment Tracking
Receipt Generation
Payment History
Digital KYC Verification
Aadhaar Verification
Identity Document Upload
Tenant Verification Workflow
Analytics Dashboard
Occupancy Reports
Revenue Reports
Complaint Trends
Hostel Performance Metrics
Notifications
Rent Reminders
Complaint Updates
Check-In Alerts
Check-Out Notifications
24. Conclusion

PG 360 successfully transforms manual PG and hostel management processes into a centralized digital solution. The application enables efficient management of hostels, rooms, tenants, occupancy records, and complaints through a secure, role-based web platform.

By leveraging React, Express.js, PostgreSQL, Drizzle ORM, JWT Authentication, and Google Cloud infrastructure, the solution delivers a scalable, maintainable, and efficient management system. The project achieves its primary goals of reducing manual effort, improving transparency, and simplifying multi-hostel administration while providing a strong foundation for future enhancements such as online payments, KYC verification, analytics dashboards, and automated notifications.