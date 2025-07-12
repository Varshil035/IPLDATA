"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables before any other imports
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const player_routes_1 = __importDefault(require("./routes/player.routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// CORS configuration
const allowedOrigins = [
    'https://ipldata.in',
    'https://www.ipldata.in',
    'https://ipldata25-git-main-ipldata25s-projects.vercel.app',
    'https://ipldata25.onrender.com'
];
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? allowedOrigins
        : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Routes
app.use('/api/players', player_routes_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        allowedOrigins
    });
});
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log('Allowed Origins:', allowedOrigins);
});
