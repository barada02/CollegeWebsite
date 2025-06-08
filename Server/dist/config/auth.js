"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
// jwt configuration
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only',
    expiresIn: '1d' // Token expires in 1 day
};
//# sourceMappingURL=auth.js.map