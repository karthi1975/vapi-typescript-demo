/**
 * TypeScript Server for Vapi Configuration
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT: number = parseInt(process.env.PORT || '3002', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
// In production, __dirname is /app/dist, so we go up one level to serve HTML files from /app
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir)); // Serve HTML files from root
app.use('/dist', express.static(path.join(__dirname))); // Serve compiled JS from dist

// Log static file serving paths for debugging
console.log('Serving static files from:', rootDir);
console.log('Serving /dist files from:', __dirname);

// API endpoint to provide Vapi configuration
app.get('/api/vapi-config', (_req: Request, res: Response): void => {
  res.json({
    publicKey: process.env.VAPI_PUBLIC_KEY || '',
    assistantId: process.env.VAPI_ASSISTANT_ID || ''
  });
});

// Health check
app.get('/health', (_req: Request, res: Response): void => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    typescript: true
  });
});

// Start server
app.listen(PORT, (): void => {
  console.log(`
========================================
TypeScript Vapi Test Server
========================================
Server running at: http://localhost:${PORT}
Config endpoint: http://localhost:${PORT}/api/vapi-config
Test page: http://localhost:${PORT}/index.html
TypeScript: ✅ Enabled
========================================
  `);
});