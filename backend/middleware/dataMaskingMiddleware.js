// Middleware to mask sensitive customer data based on user privileges

const maskSensitiveData = (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to mask data before sending
    res.json = function (data) {
        // Check if user has restricted data privilege
        const hasPrivilege = req.user && req.user.restrictedDataPrivilege;

        if (!hasPrivilege && data) {
            // Mask data based on response type
            if (Array.isArray(data)) {
                data = data.map(item => maskCustomerFields(item));
            } else if (data && typeof data === 'object') {
                data = maskCustomerFields(data);
            }
        }

        return originalJson(data);
    };

    next();
};

// Helper function to mask customer fields
const maskCustomerFields = (item) => {
    if (!item || typeof item !== 'object') {
        return item;
    }

    // Create a copy to avoid mutating original
    const masked = { ...item };

    // Mask sensitive fields
    const sensitiveFields = [
        'phone',
        'email',
        'facebookLink',
        'linkedinLink',
        'otherLink',
        'personalMobile',
        'alternateMobile',
        'officialMobile'
    ];

    sensitiveFields.forEach(field => {
        if (masked[field]) {
            masked[field] = '***RESTRICTED***';
        }
    });

    // Handle nested customer data
    if (masked.customerId && typeof masked.customerId === 'object') {
        masked.customerId = maskCustomerFields(masked.customerId);
    }

    // Handle nested userId data
    if (masked.userId && typeof masked.userId === 'object') {
        sensitiveFields.forEach(field => {
            if (masked.userId[field]) {
                masked.userId[field] = '***RESTRICTED***';
            }
        });
    }

    return masked;
};

module.exports = maskSensitiveData;
