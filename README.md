### Core Functionality
- ✅ **Team Management**: Create and manage teams with team leads
- ✅ **Agent Management**: User management with role-based access control
- ✅ **Project Management**: Organize customers by projects
- ✅ **Assignment System**: Capacity-aware customer assignment
- ✅ **Call Tracking**: Comprehensive call logging and status tracking
- ✅ **Reassignment**: Move assignments with complete history tracking

### Advanced Features
- 🔒 **Data Security**: Automatic data masking for restricted users
- 📊 **Real-time Monitoring**: Live dashboard with auto-refresh
- 📈 **Performance Reports**: Team and agent performance metrics
- 📝 **Activity Logging**: Complete audit trail of all actions
- 🔍 **Advanced Filtering**: Multi-criteria call filtering
- 📅 **Scheduling**: Schedule callbacks with reminders
- 📞 **Multi-channel Communication**: Call, SMS, WhatsApp, Email, Social Media

### Agent Interface
- Call action buttons (CALL, SMS, WhatsApp, Email, Facebook, LinkedIn)
- Schedule next contact with date/time picker
- Record call results with 13 status options
- View complete call history
- Advanced filtering and search
- Priority management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Call List Manangement"
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration:
# MONGO_URI=mongodb://localhost:27017/callcenter
# JWT_SECRET=your_secret_key_here
# PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### 5. Run the Application

**Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 📁 Project Structure

```
Call List Manangement/
├── backend/
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth, data masking, etc.
│   ├── uploads/           # Uploaded files
│   └── server.js          # Entry point
├── frontend/
│   ├── app/               # Next.js pages
│   │   ├── admin/        # Admin pages
│   │   ├── agent/        # Agent pages
│   │   └── auth/         # Authentication
│   ├── components/        # Reusable components
│   └── public/           # Static assets
└── docs/                  # Documentation
    ├── API.md            # API documentation
    ├── USER_GUIDE.md     # User guide
    └── DEPLOYMENT.md     # Deployment guide
```

## 🔑 Default Credentials

After initial setup, create an admin user via MongoDB:

```javascript
// Connect to MongoDB and run:
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // Hash of "admin123"
  role: "ADMIN",
  status: "Active",
  capacity: 5,
  restrictedDataPrivilege: true
})
```

Or use the registration endpoint to create the first user.

## 📚 Documentation

- **[API Documentation](docs/API.md)**: Complete API reference
- **[User Guide](docs/USER_GUIDE.md)**: Step-by-step user instructions
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Production deployment instructions

## 🎯 Key Pages

### Admin Pages
- `/admin/dashboard` - Admin dashboard
- `/admin/teams` - Team management
- `/admin/agents` - Agent management
- `/admin/projects` - Project management
- `/admin/assignments` - Customer assignment
- `/admin/assignments/reassign` - Reassignment with history
- `/admin/monitoring` - Real-time monitoring dashboard
- `/admin/reports/activity-logs` - Activity logs viewer

### Agent Pages
- `/agent/dashboard` - Agent dashboard
- `/agent/my-calls` - Enhanced call management interface

## 🔐 User Roles & Permissions

| Feature | ADMIN | MANAGER | AGENT | TRAINEE |
|---------|-------|---------|-------|---------|
| Team Management | ✅ | ✅ | ❌ | ❌ |
| Agent Management | ✅ | ✅ | ❌ | ❌ |
| Project Management | ✅ | ✅ | ❌ | ❌ |
| Assign Customers | ✅ | ✅ | ❌ | ❌ |
| Reassign Customers | ✅ | ✅ | ❌ | ❌ |
| View Reports | ✅ | ✅ | ❌ | ❌ |
| View Activity Logs | ✅ | ✅ | ❌ | ❌ |
| Manage Own Calls | ✅ | ✅ | ✅ | ✅ |
| Record Call Results | ✅ | ✅ | ✅ | ✅ |
| Schedule Callbacks | ✅ | ✅ | ✅ | ✅ |
| View Restricted Data | * | * | * | * |

\* Depends on `restrictedDataPrivilege` flag

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions by role
- **Data Masking**: Automatic masking of sensitive data
- **Activity Logging**: Complete audit trail
- **Password Hashing**: bcrypt for secure password storage

## 📊 Database Models

- **User**: User accounts with roles and capacity
- **Team**: Team organization
- **TeamMember**: Team membership tracking
- **Project**: Project management
- **Customer**: Customer information (20+ fields)
- **Assignment**: Customer-agent assignments
- **CallLog**: Call attempt records
- **AssignmentHistory**: Reassignment audit trail
- **ActivityLog**: System activity tracking

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:teamId/members` - Add member
- `DELETE /api/teams/:teamId/members/:memberId` - Remove member

### Assignments
- `GET /api/admin/agents/:agentId/capacity` - Check capacity
- `POST /api/admin/assign` - Assign customers
- `POST /api/admin/reassign` - Reassign customers
- `GET /api/admin/assignments/:id/history` - Get history

### Agent
- `GET /api/agent/my-calls` - Get assigned calls
- `GET /api/agent/calls/filter` - Filter calls
- `POST /api/agent/call/:id/update-status` - Update status
- `POST /api/agent/call/:id/schedule` - Schedule callback
- `GET /api/agent/call/:id/history` - Get call history

### Reports
- `GET /api/reports/dashboard-summary` - Dashboard stats
- `GET /api/reports/team-summary` - Team performance
- `GET /api/reports/agent-performance` - Agent metrics
- `GET /api/reports/call-statistics` - Call stats
- `GET /api/reports/activity-logs` - Activity logs

## 🧪 Testing

```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

## 📈 Performance Optimization

- Pagination on large datasets
- Database indexing on frequently queried fields
- Auto-refresh with configurable intervals
- Efficient data masking middleware
- Optimized MongoDB queries

## 🐛 Known Issues

None currently identified. All features are working as expected.

## 🔄 Future Enhancements

- [ ] Real-time notifications via WebSocket
- [ ] Email notifications for scheduled callbacks
- [ ] Advanced analytics dashboard
- [ ] Export reports to PDF/Excel
- [ ] Mobile app for agents
- [ ] Voice call integration
- [ ] SMS gateway integration
- [ ] WhatsApp Business API integration

## 📝 License

[Your License Here]

## 👥 Contributors

[Your Team/Contributors]

## 📞 Support

For support, email [support@example.com] or create an issue in the repository.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for call center management.
