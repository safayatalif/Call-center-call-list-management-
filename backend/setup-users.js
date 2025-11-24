const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const createUsers = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
        } else {
            // Create Admin
            const adminPassword = await bcrypt.hash('admin123', 10);
            const admin = new User({
                name: 'Admin User',
                email: 'admin@example.com',
                password: adminPassword,
                role: 'admin',
                status: 'active'
            });
            await admin.save();
            console.log('✅ Admin user created!');
            console.log('   Email: admin@example.com');
            console.log('   Password: admin123');
        }

        // Check if agent already exists
        const existingAgent = await User.findOne({ email: 'agent@example.com' });
        if (existingAgent) {
            console.log('\nAgent user already exists!');
        } else {
            // Create Agent
            const agentPassword = await bcrypt.hash('agent123', 10);
            const agent = new User({
                name: 'Agent User',
                email: 'agent@example.com',
                password: agentPassword,
                role: 'agent',
                status: 'active'
            });
            await agent.save();
            console.log('\n✅ Agent user created!');
            console.log('   Email: agent@example.com');
            console.log('   Password: agent123');
        }

        console.log('\n🎉 Setup complete! You can now login.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating users:', error);
        process.exit(1);
    }
};

createUsers();
