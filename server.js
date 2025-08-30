/**
 * Simple server to provide Vapi configuration
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API endpoint to provide Vapi configuration
app.get('/api/vapi-config', (req, res) => {
  res.json({
    publicKey: process.env.VAPI_PUBLIC_KEY || '',
    assistantId: process.env.VAPI_ASSISTANT_ID || ''
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
========================================
TypeScript Vapi Test Server
========================================
Server running at: http://localhost:${PORT}
Config endpoint: http://localhost:${PORT}/api/vapi-config
Test page: http://localhost:${PORT}/typescript-vapi.html
========================================
  `);
});