"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const errorHandler_1 = require("./middleware/errorHandler");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const events_1 = __importDefault(require("./routes/events"));
// Load environment variables
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, db_1.connectDB)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Define routes
app.use('/api/auth', auth_1.default);
app.use('/api/events', events_1.default);
// Basic route for testing
app.get('/', (req, res) => {
    res.send('College Website API is running');
});
// Error handler middleware (should be last)
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map