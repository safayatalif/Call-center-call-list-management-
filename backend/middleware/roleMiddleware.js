const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // Convert old roles to new format for backward compatibility
        const roleMap = {
            'admin': 'ADMIN',
            'agent': 'AGENT'
        };

        const userRole = roleMap[req.user.role] || req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = roleMiddleware;
