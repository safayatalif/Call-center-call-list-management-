# User Guide - Enhanced Call Center Management System

## Table of Contents
1. [Getting Started](#getting-started)
2. [Admin Guide](#admin-guide)
3. [Agent Guide](#agent-guide)
4. [Manager Guide](#manager-guide)

---

## Getting Started

### System Access

1. **Login Page**: Navigate to `http://localhost:3000/login`
2. **Enter Credentials**: Use your email and password
3. **Dashboard**: You'll be redirected based on your role:
   - **Admin/Manager**: `/admin/dashboard`
   - **Agent/Trainee**: `/agent/dashboard`

### User Roles

- **ADMIN**: Full system access, can manage everything
- **MANAGER**: Team and agent management, reporting access
- **AGENT**: Access to assigned calls, can update call status
- **TRAINEE**: Similar to agent, limited access

---

## Admin Guide

### 1. Team Management

#### Creating a Team

1. Navigate to **Teams** from the sidebar
2. Click **Create New Team**
3. Fill in the form:
   - **Team Name**: Enter a descriptive name
   - **Description**: Optional team description
   - **Team Type**: Select category (Page Moderator, Re-Order, Corporate, etc.)
   - **Team Lead**: Select from existing users
   - **Status**: Active or Inactive
4. Click **Create Team**

#### Managing Team Members

1. Go to **Teams** and click on a team
2. Click **Manage Members**
3. **Add Members**:
   - Search for users in the "Available Users" panel
   - Click on users to select them
   - Click **Add Selected Members**
4. **Remove Members**:
   - Find member in "Current Members" panel
   - Click **Remove** next to their name

### 2. Agent Management

#### Creating an Agent

1. Navigate to **Agents**
2. Click **Create New Agent**
3. Fill in the form:
   - **Name**: Full name
   - **Email**: Unique email address
   - **Password**: Initial password
   - **Role**: AGENT, MANAGER, or TRAINEE
   - **Capacity**: Number of projects (0-5, default: 3)
4. Click **Create Agent**

#### Updating Agent Information

1. Go to **Agents**
2. Click **Edit** on the agent
3. Update fields as needed
4. Click **Save Changes**

### 3. Project Management

#### Creating a Project

1. Navigate to **Projects**
2. Click **Create New Project**
3. Fill in the form:
   - **Project Name**: Descriptive name
   - **Description**: Project details
   - **Status**: OPEN, CLOSED, HOLD, or PENDING
   - **Start/End Date**: Optional dates
   - **Default Team**: Optional team assignment
4. Click **Create Project**

#### Uploading Customer List

1. Go to **Projects** and select a project
2. Click **Upload Customers**
3. **Prepare CSV File** with columns:
   - name, phone, email, area, address
   - facebookLink, linkedinLink, otherLink
   - customerType, gender, birthdate
   - (See full list in API documentation)
4. Click **Choose File** and select your CSV
5. Click **Upload**
6. Wait for confirmation

### 4. Assignment Management

#### Assigning Customers to Agents

1. Navigate to **Assignments**
2. **Step 1**: Select a project from dropdown
3. **Step 2**: Select an agent
   - View agent's current capacity
   - See available slots
4. **Step 3**: Select customers
   - Click individual customers or use "Select All"
   - Review assignment summary
5. Click **Assign Customers**
6. **Capacity Warning**: If agent is at capacity, you'll see a warning
   - You can override if necessary

#### Reassigning Customers

1. Navigate to **Assignments** → **Reassign**
2. **Step 1**: Select source agent (current agent)
3. **Step 2**: Select target agent (new agent)
4. Select assignments to move
5. Enter reason for reassignment
6. Click **Reassign**
7. **View History**: Click "View History" on any assignment to see audit trail

### 5. Monitoring & Reports

#### Dashboard Overview

1. Navigate to **Monitoring**
2. View real-time statistics:
   - Active Users
   - Active Teams
   - Total Assignments
   - Total Call Logs
3. **Call Status Breakdown**: Visual chart of call statuses
4. **Recent Activities**: Last 10 system activities
5. **Auto-refresh**: Dashboard updates every 30 seconds

#### Activity Logs

1. Navigate to **Monitoring** → **Activity Logs**
2. **Filter Logs**:
   - Action: Search by action text
   - Target Type: Filter by Assignment/Customer/Project/Team/User
   - Date Range: Select start and end dates
3. Click **Apply Filters**
4. **View Details**: Each log shows:
   - Action performed
   - User who performed it
   - Target type and details
   - Timestamp
5. **Pagination**: Navigate through pages at bottom

#### Team Performance

1. Navigate to **Reports** → **Team Summary** (API available)
2. View metrics for each team:
   - Member count
   - Total assignments
   - Call statistics
   - Success rate

---

## Agent Guide

### 1. Viewing Your Calls

1. Navigate to **My Calls** from sidebar
2. View summary statistics at top:
   - Total Calls
   - Pending
   - Sales Generated
   - Scheduled
3. Each call card shows:
   - Customer name and contact info
   - Current status
   - Priority level
   - Latest notes

### 2. Filtering Calls

1. Click **Advanced Filters** to expand
2. Set filters:
   - **Search**: Name, phone, or email
   - **Status**: Filter by call status
   - **Priority**: Low, Medium, High
   - **Customer Type**: New, Regular, Reorder
   - **Date Range**: Start and end dates
3. Filters apply automatically
4. Click **Reset Filters** to clear

### 3. Contacting Customers

#### Making Calls

1. Find customer in your calls list
2. Click **CALL** button
3. Your phone app will open with the number

#### Sending Messages

- **SMS**: Click **SMS** button
- **WhatsApp**: Click **WhatsApp** button (opens WhatsApp Web)
- **Email**: Click **Email** button (opens email client)

#### Social Media

- **Facebook**: Click **Facebook** button (if link available)
- **LinkedIn**: Click **LinkedIn** button (if link available)

### 4. Recording Call Results

1. After contacting a customer, click **Record Call Result**
2. Fill in the form:
   - **Communication Method**: Call, SMS, WhatsApp, Email, etc.
   - **Call Status**: Select from 13 options:
     - Pending, Hold, Recall Required
     - Non-Responsive, Sales Generated
     - Call Later, Received, Not Reachable
     - Closed, Not Relevant, Scheduled, Others
   - **Status Description**: Brief outcome description
   - **Priority**: Low, Medium, High
   - **Notes**: Detailed notes (required)
   - **Follow-up Date**: Optional future date
3. Click **Save Call Result**

### 5. Scheduling Callbacks

1. Click **Schedule Next Contact** on a call
2. Fill in the form:
   - **Date**: Select callback date
   - **Time**: Select callback time
   - **Priority**: Low, Medium, High
   - **Notes**: Context for the callback
3. Click **Schedule Contact**
4. Call will appear in "Scheduled" status

### 6. Viewing Call History

1. Click **View History** on any call
2. See complete timeline:
   - All previous call attempts
   - Status changes
   - Notes from each interaction
   - Communication methods used
   - Timestamps
3. Click **Hide History** to collapse

---

## Manager Guide

Managers have access to both Admin and Agent features:

### Admin Capabilities
- Create and manage teams
- Assign team members
- View all reports
- Monitor team performance
- Access activity logs

### Agent Capabilities
- View assigned calls (if any)
- Make calls and record results
- Schedule callbacks
- Use all agent features

### Best Practices

1. **Daily Monitoring**:
   - Check dashboard for overview
   - Review team performance
   - Monitor activity logs

2. **Team Management**:
   - Balance workload across agents
   - Use capacity checking before assignments
   - Track reassignment reasons

3. **Performance Tracking**:
   - Review agent performance reports
   - Monitor success rates
   - Identify training needs

---

## Tips & Best Practices

### For Admins

1. **Capacity Management**:
   - Set realistic capacity limits (default: 3, max: 5)
   - Monitor agent workload regularly
   - Use reassignment to balance load

2. **Data Security**:
   - Grant `restrictedDataPrivilege` only to trusted users
   - Regularly review activity logs
   - Monitor data access patterns

3. **Team Organization**:
   - Create teams by specialization
   - Assign appropriate team leads
   - Keep team sizes manageable

### For Agents

1. **Call Management**:
   - Prioritize high-priority calls
   - Update status immediately after calls
   - Add detailed notes for context

2. **Scheduling**:
   - Schedule callbacks at customer-preferred times
   - Set reminders for scheduled calls
   - Follow up on time

3. **Communication**:
   - Use appropriate communication method
   - Record method used in call result
   - Track customer preferences

### For Everyone

1. **Regular Updates**:
   - Keep call status current
   - Add meaningful notes
   - Update follow-up dates

2. **Data Quality**:
   - Verify customer information
   - Report data issues
   - Keep records accurate

3. **System Usage**:
   - Use filters to find calls quickly
   - Leverage history for context
   - Monitor your dashboard regularly

---

## Troubleshooting

### Login Issues

**Problem**: Cannot login
**Solution**:
- Verify email and password
- Check with admin if account is active
- Clear browser cache and try again

### Data Not Showing

**Problem**: Calls/customers not appearing
**Solution**:
- Check filters are not too restrictive
- Verify you have assignments
- Refresh the page
- Contact admin if issue persists

### Assignment Errors

**Problem**: Cannot assign customers
**Solution**:
- Check agent capacity
- Verify project has customers
- Ensure you have admin/manager role
- Try with fewer customers

### Performance Issues

**Problem**: Page loading slowly
**Solution**:
- Clear browser cache
- Close unnecessary tabs
- Check internet connection
- Contact IT support

---

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Quick search (if implemented)
- `Esc`: Close modals
- `Enter`: Submit forms

---

## Support

For technical support or questions:
- Contact your system administrator
- Refer to API documentation for developers
- Check activity logs for audit trail

---

## Glossary

- **Assignment**: A customer assigned to an agent
- **Capacity**: Maximum number of projects an agent can handle
- **Call Log**: Record of a call attempt or contact
- **Reassignment**: Moving a customer from one agent to another
- **Restricted Data**: Sensitive customer information requiring special privileges
- **Team Lead**: User responsible for managing a team
- **Follow-up Date**: Scheduled date for next contact attempt
