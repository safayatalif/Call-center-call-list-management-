# API Documentation - Enhanced Call Center Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### POST /auth/login
Login to the system.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "AGENT"
  }
}
```

---

## Team Management Endpoints

### POST /teams
Create a new team.

**Required Role:** ADMIN, MANAGER

**Request Body:**
```json
{
  "teamName": "Sales Team A",
  "description": "Primary sales team",
  "teamFor": "Corporate",
  "teamLead": "user_id",
  "status": "active"
}
```

### GET /teams
Get all teams.

**Required Role:** ADMIN, MANAGER

**Response:**
```json
[
  {
    "_id": "team_id",
    "teamName": "Sales Team A",
    "description": "Primary sales team",
    "teamFor": "Corporate",
    "teamLead": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "status": "active",
    "createdAt": "2025-11-24T10:00:00.000Z"
  }
]
```

### GET /teams/:id
Get team details with members.

**Required Role:** ADMIN, MANAGER

**Response:**
```json
{
  "team": { /* team object */ },
  "members": [
    {
      "_id": "member_id",
      "userId": {
        "_id": "user_id",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "AGENT",
        "capacity": 3
      },
      "assignedDate": "2025-11-24T10:00:00.000Z",
      "status": "active"
    }
  ]
}
```

### PUT /teams/:id
Update team information.

**Required Role:** ADMIN, MANAGER

**Request Body:**
```json
{
  "teamName": "Updated Team Name",
  "description": "Updated description",
  "status": "inactive"
}
```

### DELETE /teams/:id
Delete a team.

**Required Role:** ADMIN, MANAGER

### POST /teams/:teamId/members
Add member to team.

**Required Role:** ADMIN, MANAGER

**Request Body:**
```json
{
  "userId": "user_id"
}
```

### DELETE /teams/:teamId/members/:memberId
Remove member from team.

**Required Role:** ADMIN, MANAGER

---

## Assignment Management Endpoints

### GET /admin/agents/:agentId/capacity
Check agent capacity.

**Required Role:** ADMIN, MANAGER

**Response:**
```json
{
  "agentId": "agent_id",
  "agentName": "John Doe",
  "currentAssignments": 5,
  "capacity": 5,
  "available": false,
  "remaining": 0
}
```

### POST /admin/assign
Assign customers to agent.

**Required Role:** ADMIN, MANAGER

**Request Body:**
```json
{
  "customerIds": ["customer_id_1", "customer_id_2"],
  "agentId": "agent_id",
  "overrideCapacity": false
}
```

**Response:**
```json
{
  "message": "Customers assigned successfully",
  "count": 2,
  "capacityWarning": false
}
```

**Error Response (Capacity Exceeded):**
```json
{
  "message": "Agent capacity exceeded",
  "currentAssignments": 5,
  "capacity": 5,
  "requested": 2,
  "overCapacity": 2
}
```

### POST /admin/reassign
Reassign customers to different agent.

**Required Role:** ADMIN, MANAGER

**Request Body:**
```json
{
  "assignmentIds": ["assignment_id_1", "assignment_id_2"],
  "newAgentId": "new_agent_id",
  "reason": "Workload balancing"
}
```

**Response:**
```json
{
  "message": "Customers reassigned successfully",
  "count": 2
}
```

### GET /admin/assignments/:assignmentId/history
Get assignment history.

**Required Role:** ADMIN, MANAGER

**Response:**
```json
[
  {
    "_id": "history_id",
    "previousAgent": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "newAgent": {
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "reassignedBy": {
      "name": "Admin User"
    },
    "reassignDate": "2025-11-24T10:00:00.000Z",
    "reason": "Workload balancing"
  }
]
```

### POST /admin/bulk-update
Bulk update assignments.

**Required Role:** ADMIN, MANAGER

**Request Body:**
```json
{
  "assignmentIds": ["id1", "id2"],
  "updates": {
    "agentId": "new_agent_id"
  }
}
```

---

## Agent Endpoints

### GET /agent/my-calls
Get agent's assigned calls.

**Required Role:** AGENT, TRAINEE, MANAGER

**Response:**
```json
[
  {
    "_id": "assignment_id",
    "customerId": {
      "_id": "customer_id",
      "name": "Customer Name",
      "phone": "+8801234567890",
      "email": "customer@example.com"
    },
    "assignedBy": {
      "name": "Admin User"
    },
    "callStatus": {
      "_id": "call_log_id",
      "status": "Pending",
      "notes": "Initial contact",
      "priority": "Medium",
      "createdAt": "2025-11-24T10:00:00.000Z"
    }
  }
]
```

### GET /agent/calls/filter
Filter calls with advanced criteria.

**Required Role:** AGENT, TRAINEE, MANAGER

**Query Parameters:**
- `status` - Filter by call status
- `priority` - Filter by priority (Low/Medium/High)
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)
- `customerType` - Filter by customer type
- `search` - Search in name/phone/email

**Example:**
```
GET /agent/calls/filter?status=Pending&priority=High&search=john
```

### POST /agent/call/:id/update-status
Update call status.

**Required Role:** AGENT, TRAINEE, MANAGER

**Request Body:**
```json
{
  "status": "Sales Generated",
  "notes": "Customer agreed to purchase",
  "priority": "High",
  "followUpDate": "2025-11-25",
  "communicationMethod": "Call",
  "statusText": "Successful sale"
}
```

### POST /agent/call/:id/schedule
Schedule next contact.

**Required Role:** AGENT, TRAINEE, MANAGER

**Request Body:**
```json
{
  "targetDateTime": "2025-11-25T10:00:00",
  "notes": "Follow up on quote",
  "priority": "Medium"
}
```

### GET /agent/call/:id/history
Get call history for assignment.

**Required Role:** AGENT, TRAINEE, MANAGER

**Response:**
```json
[
  {
    "_id": "call_log_id",
    "status": "Pending",
    "notes": "Initial contact",
    "priority": "Medium",
    "communicationMethod": "Call",
    "calledDateTime": "2025-11-24T10:00:00.000Z",
    "updatedBy": {
      "name": "Agent Name"
    },
    "createdAt": "2025-11-24T10:00:00.000Z"
  }
]
```

---

## Reporting Endpoints

### GET /reports/dashboard-summary
Get dashboard summary statistics.

**Required Role:** ADMIN, MANAGER

**Response:**
```json
{
  "totalUsers": 25,
  "totalTeams": 5,
  "totalAssignments": 150,
  "totalCallLogs": 450,
  "statusBreakdown": {
    "Pending": 50,
    "Sales Generated": 30,
    "Closed": 20
  },
  "recentActivities": [
    {
      "_id": "activity_id",
      "action": "Team Created",
      "performedBy": {
        "name": "Admin User"
      },
      "details": "Created team: Sales Team A",
      "createdAt": "2025-11-24T10:00:00.000Z"
    }
  ]
}
```

### GET /reports/team-summary
Get team performance summary.

**Required Role:** ADMIN, MANAGER

**Response:**
```json
[
  {
    "teamId": "team_id",
    "teamName": "Sales Team A",
    "teamLead": "John Doe",
    "memberCount": 5,
    "totalAssignments": 50,
    "totalCalls": 150,
    "pendingCalls": 20,
    "completedCalls": 100,
    "salesGenerated": 30,
    "successRate": "20.00"
  }
]
```

### GET /reports/agent-performance
Get agent performance metrics.

**Required Role:** ADMIN, MANAGER

**Query Parameters:**
- `agentId` - Filter by specific agent
- `startDate` - Start date for filtering
- `endDate` - End date for filtering

**Response:**
```json
[
  {
    "agentId": "agent_id",
    "agentName": "John Doe",
    "agentEmail": "john@example.com",
    "role": "AGENT",
    "totalAssignments": 10,
    "callsMade": 30,
    "pending": 5,
    "salesGenerated": 8,
    "completed": 25,
    "successRate": "26.67",
    "completionRate": "83.33",
    "callsByStatus": {
      "Pending": 5,
      "Sales Generated": 8,
      "Closed": 17
    }
  }
]
```

### GET /reports/call-statistics
Get call statistics.

**Required Role:** ADMIN, MANAGER

**Query Parameters:**
- `projectId` - Filter by project
- `teamId` - Filter by team
- `startDate` - Start date
- `endDate` - End date

**Response:**
```json
{
  "totalCalls": 450,
  "totalAssignments": 150,
  "statusBreakdown": {
    "Pending": 50,
    "Sales Generated": 30
  },
  "priorityBreakdown": {
    "Low": 100,
    "Medium": 250,
    "High": 100
  },
  "methodBreakdown": {
    "Call": 300,
    "WhatsApp": 100,
    "Email": 50
  },
  "averageCallsPerAssignment": "3.00"
}
```

### GET /reports/activity-logs
Get activity logs with pagination.

**Required Role:** ADMIN, MANAGER

**Query Parameters:**
- `userId` - Filter by user
- `targetType` - Filter by target type (Assignment/Customer/Project/Team/User)
- `action` - Search in action text
- `startDate` - Start date
- `endDate` - End date
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Response:**
```json
{
  "logs": [
    {
      "_id": "log_id",
      "action": "Team Created",
      "performedBy": {
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "ADMIN"
      },
      "targetType": "Team",
      "targetId": "team_id",
      "details": "Created team: Sales Team A",
      "createdAt": "2025-11-24T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalLogs": 500,
    "limit": 50
  }
}
```

---

## Data Masking

Sensitive customer data is automatically masked for users without `restrictedDataPrivilege`:

**Masked Fields:**
- phone
- email
- facebookLink
- linkedinLink
- otherLink
- personalMobile
- alternateMobile
- officialMobile

**Masked Value:** `***RESTRICTED***`

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Agent capacity exceeded",
  "currentAssignments": 5,
  "capacity": 5
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "message": "Team not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
