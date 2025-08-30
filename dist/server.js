"use strict";
/**
 * TypeScript Server for Vapi Configuration
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var dotenv = __importStar(require("dotenv"));
// Load .env file
dotenv.config({ path: path_1.default.join(__dirname, '../.env') });
var app = (0, express_1.default)();
var PORT = parseInt(process.env.PORT || '3002', 10);
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files
// In production, __dirname is /app/dist, so we go up one level to serve HTML files from /app
var rootDir = path_1.default.join(__dirname, '..');
app.use(express_1.default.static(rootDir)); // Serve HTML files from root
app.use('/dist', express_1.default.static(path_1.default.join(__dirname))); // Serve compiled JS from dist
// Log static file serving paths for debugging
console.log('Serving static files from:', rootDir);
console.log('Serving /dist files from:', __dirname);
// API endpoint to provide Vapi configuration
app.get('/api/vapi-config', function (_req, res) {
    res.json({
        publicKey: process.env.VAPI_PUBLIC_KEY || '',
        assistantId: process.env.VAPI_ASSISTANT_ID || ''
    });
});
// Health check
app.get('/health', function (_req, res) {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        typescript: true
    });
});
// Start server
app.listen(PORT, function () {
    console.log("\n========================================\nTypeScript Vapi Test Server\n========================================\nServer running at: http://localhost:".concat(PORT, "\nConfig endpoint: http://localhost:").concat(PORT, "/api/vapi-config\nTest page: http://localhost:").concat(PORT, "/index.html\nTypeScript: \u2705 Enabled\n========================================\n  "));
});
