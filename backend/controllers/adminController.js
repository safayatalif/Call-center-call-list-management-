const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcryptjs');

exports.createAgent = async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        capacity,
        personalMobile,
        alternateMobile,
        officialMobile,
        socialMediaIds,
        address,
        remarks,
        status,
        restrictedDataPrivilege
    } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'AGENT',
            capacity: capacity || 3,
            personalMobile,
            alternateMobile,
            officialMobile,
            socialMediaIds: socialMediaIds || {},
            address,
            remarks,
            status: status || 'Active',
            restrictedDataPrivilege: restrictedDataPrivilege || false
        });

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: { $in: ['AGENT', 'MANAGER', 'TRAINEE'] } }).select('-password');
        res.json(agents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateAgent = async (req, res) => {
    const { name, status } = req.body;
    try {
        let agent = await User.findById(req.params.id);
        if (!agent) return res.status(404).json({ message: 'Agent not found' });

        if (name) agent.name = name;
        if (status) agent.status = status;

        await agent.save();
        res.json(agent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Project Management
exports.createProject = async (req, res) => {
    const { projectName, description } = req.body;
    try {
        const project = new Project({
            projectName,
            description,
            createdBy: req.user.id
        });
        await project.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateProject = async (req, res) => {
    const { projectName, description } = req.body;
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (projectName) project.projectName = projectName;
        if (description) project.description = description;

        await project.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
