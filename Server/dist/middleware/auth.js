"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');
    // Check if token exists
    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, auth_1.jwtConfig.secret);
        // Add user from payload to request
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map