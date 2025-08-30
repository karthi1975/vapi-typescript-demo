# TypeScript Vapi Voice Assistant 🎤

A production-ready, 100% TypeScript-based voice assistant application using Vapi AI platform.

**Live Demo:** https://vapitypescriptdemo-production.up.railway.app/

## 🚀 Features

- **Full TypeScript Architecture** - Server and client written entirely in TypeScript
- **Docker Ready** - Multi-stage Docker build for optimal production deployment
- **Railway Compatible** - One-click deployment to Railway platform
- **Secure Configuration** - Environment-based configuration with no hardcoded secrets
- **Real-time Voice Interaction** - Powered by Vapi AI's voice processing
- **Modern Build Pipeline** - Webpack bundling with TypeScript compilation

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Vapi AI account with API credentials

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/karthi1975/vapi_typescript_demo.git
cd typescript_vapi
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your Vapi credentials:
```env
VAPI_PUBLIC_KEY=your-vapi-public-key
VAPI_ASSISTANT_ID=your-assistant-id
PORT=3002
```

## 🏗️ Development

Build TypeScript files:
```bash
npm run build
```

Start development server:
```bash
npm run dev
```

Watch for changes:
```bash
npm run watch
```

## 🐳 Docker Deployment

Build Docker image:
```bash
docker build -t vapi-typescript .
```

Run container:
```bash
docker run -p 3002:3002 --env-file .env vapi-typescript
```

## 🚂 Railway Deployment

1. Push to GitHub
2. Connect GitHub repo to Railway
3. Set environment variables in Railway dashboard:
   - `VAPI_PUBLIC_KEY`
   - `VAPI_ASSISTANT_ID`
4. Deploy!

Railway will automatically:
- Detect Dockerfile
- Build the multi-stage image
- Deploy the production container

## 📁 Project Structure

```
├── src/                    # TypeScript source
│   ├── server.ts          # Express server
│   └── browser/           # Client code
│       └── vapi-client.ts # Vapi client class
├── dist/                  # Compiled JavaScript
├── Dockerfile             # Docker configuration
├── tsconfig.json          # TypeScript config
├── webpack.config.js      # Webpack bundler
└── package.json           # Dependencies
```

## 🔧 Configuration

Environment variables:
- `VAPI_PUBLIC_KEY` - Your Vapi public API key
- `VAPI_ASSISTANT_ID` - Your Vapi assistant ID
- `PORT` - Server port (default: 3002)

## 📖 Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system architecture and data flow.

## 🎯 Usage

1. Open browser to `http://localhost:3002/typescript-index.html`
2. Wait for "Ready" status
3. Click the teal phone button that appears
4. Start speaking with the voice assistant!

## 🔒 Security

- No API keys in client code
- Server-side configuration management
- Environment-based secrets
- TypeScript type safety
- Docker security best practices

## 📊 Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web server framework
- **Webpack** - Module bundler
- **Vapi AI** - Voice processing platform
- **Docker** - Containerization
- **Railway** - Cloud deployment

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Karthi Jeyabalan

---

Built with TypeScript and ❤️ for production voice applications.