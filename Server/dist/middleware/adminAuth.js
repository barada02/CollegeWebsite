"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const adminAuth = (req, res, next) => {
    // Check if user exists in request (should be set by auth middleware)
    if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    // Check if user is an admin
    if (req.user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied. Admin privileges required' });
        return;
    }
    // If user is admin, proceed
    next();
};
exports.adminAuth = adminAuth;
//# sourceMappingURL=adminAuth.js.map