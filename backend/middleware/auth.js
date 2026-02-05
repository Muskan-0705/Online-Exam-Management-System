const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    console.log('🔐 Auth Check:');
    console.log('  Authorization Header:', authHeader ? '✅ Present' : '❌ Missing');
    console.log('  Token:', token ? '✅ Present' : '❌ Missing');
    
    if (!token) {
        console.log('  Result: ❌ REJECTED - No token');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('  Token decoded:', decoded);
        console.log('  User ID:', decoded.id);
        console.log('  User Role:', decoded.role);
        req.user = decoded;
        console.log('  Result: ✅ AUTHORIZED');
        next();
    } catch (err) {
        console.error('  ❌ Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        const hasRole = userRole && roles.includes(userRole);
        
        console.log('👤 Role Check:');
        console.log('  User Role:', userRole || '❌ Not found');
        console.log('  Required Roles:', roles);
        console.log('  Has Required Role:', hasRole ? '✅ YES' : '❌ NO');
        
        if (!hasRole) {
            console.log('  Result: ❌ REJECTED - Insufficient permissions');
            return res.status(403).json({ 
                message: 'Access denied: insufficient permissions',
                userRole: userRole,
                requiredRoles: roles
            });
        }
        
        console.log('  Result: ✅ AUTHORIZED');
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
