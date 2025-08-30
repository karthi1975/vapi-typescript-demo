/**
 * TypeScript Vapi Browser Client
 * This is the main client that will be compiled and bundled for browser use
 */

// Type definitions
interface VapiSDK {
  run(config: VapiConfig): VapiInstance;
}

interface VapiConfig {
  apiKey: string;
  assistant: string;
  config?: {
    hideButton?: boolean;
    [key: string]: any;
  };
}

interface VapiInstance {
  on(event: string, callback: (data: any) => void): void;
  start?(): void;
  stop?(): void;
  send?(message: any): void;
}

interface TranscriptMessage {
  type: 'transcript';
  role: 'user' | 'assistant';
  transcript: string;
  timestamp?: string;
}

interface FunctionCallEvent {
  functionCall: {
    name: string;
    parameters: Record<string, any>;
  };
}

// Declare global window interface
declare global {
  interface Window {
    vapiSDK: VapiSDK;
    VapiClient: typeof VapiClient;
    initializeVapi: () => Promise<void>;
  }
}

/**
 * Main Vapi Client Class
 */
export class VapiClient {
  private vapiInstance: VapiInstance | null = null;
  private publicKey: string = '';
  private assistantId: string = '';
  private isCallActive: boolean = false;
  private initRetries: number = 0;
  private maxRetries: number = 10;
  
  // Event callbacks
  private callbacks: {
    onReady?: () => void;
    onCallStart?: () => void;
    onCallEnd?: () => void;
    onTranscript?: (message: TranscriptMessage) => void;
    onFunctionCall?: (event: FunctionCallEvent) => void;
    onError?: (error: any) => void;
  } = {};

  /**
   * Initialize with configuration from server
   */
  public async initializeFromServer(): Promise<void> {
    try {
      const response = await fetch('/api/vapi-config');
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status}`);
      }
      
      const config = await response.json();
      if (!config.publicKey || !config.assistantId) {
        throw new Error('Invalid configuration from server');
      }
      
      this.publicKey = config.publicKey;
      this.assistantId = config.assistantId;
      
      console.log('✅ Configuration loaded from server');
      await this.initialize();
    } catch (error) {
      console.error('Failed to initialize from server:', error);
      throw error;
    }
  }

  /**
   * Initialize the Vapi SDK
   */
  private async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const attemptInit = () => {
        if (!window.vapiSDK) {
          this.initRetries++;
          if (this.initRetries >= this.maxRetries) {
            reject(new Error('Vapi SDK failed to load after maximum retries'));
            return;
          }
          console.log(`Waiting for Vapi SDK... (attempt ${this.initRetries}/${this.maxRetries})`);
          setTimeout(attemptInit, 1000);
          return;
        }

        try {
          console.log('Initializing Vapi with assistant...');
          
          this.vapiInstance = window.vapiSDK.run({
            apiKey: this.publicKey,
            assistant: this.assistantId,
            config: {
              hideButton: false
            }
          });

          this.setupEventHandlers();
          console.log('✅ Vapi initialized successfully!');
          
          if (this.callbacks.onReady) {
            this.callbacks.onReady();
          }
          
          resolve();
        } catch (error) {
          console.error('Failed to initialize Vapi:', error);
          reject(error);
        }
      };

      attemptInit();
    });
  }

  /**
   * Set up event handlers for Vapi instance
   */
  private setupEventHandlers(): void {
    if (!this.vapiInstance) return;

    this.vapiInstance.on('call-start', () => {
      this.isCallActive = true;
      console.log('📞 Call started');
      if (this.callbacks.onCallStart) {
        this.callbacks.onCallStart();
      }
    });

    this.vapiInstance.on('call-end', () => {
      this.isCallActive = false;
      console.log('📞 Call ended');
      if (this.callbacks.onCallEnd) {
        this.callbacks.onCallEnd();
      }
    });

    this.vapiInstance.on('message', (msg: any) => {
      if (msg.type === 'transcript' && msg.transcript) {
        const transcriptMessage: TranscriptMessage = {
          type: 'transcript',
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          transcript: msg.transcript,
          timestamp: new Date().toISOString()
        };
        
        console.log(`${transcriptMessage.role}: ${transcriptMessage.transcript}`);
        
        if (this.callbacks.onTranscript) {
          this.callbacks.onTranscript(transcriptMessage);
        }
      }
    });

    this.vapiInstance.on('function-call', (event: FunctionCallEvent) => {
      console.log('🔧 Function call:', event.functionCall.name);
      if (this.callbacks.onFunctionCall) {
        this.callbacks.onFunctionCall(event);
      }
    });

    this.vapiInstance.on('error', (error: any) => {
      console.error('❌ Vapi error:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
    });
  }

  /**
   * Register event callbacks
   */
  public on(event: 'ready' | 'callStart' | 'callEnd' | 'transcript' | 'functionCall' | 'error', callback: any): void {
    switch (event) {
      case 'ready':
        this.callbacks.onReady = callback;
        break;
      case 'callStart':
        this.callbacks.onCallStart = callback;
        break;
      case 'callEnd':
        this.callbacks.onCallEnd = callback;
        break;
      case 'transcript':
        this.callbacks.onTranscript = callback;
        break;
      case 'functionCall':
        this.callbacks.onFunctionCall = callback;
        break;
      case 'error':
        this.callbacks.onError = callback;
        break;
    }
  }

  /**
   * Check if a call is currently active
   */
  public isActive(): boolean {
    return this.isCallActive;
  }

  /**
   * Get current configuration
   */
  public getConfig(): { publicKey: string; assistantId: string } {
    return {
      publicKey: this.publicKey,
      assistantId: this.assistantId
    };
  }
}

// UI Helper functions
export function addTranscript(role: string, content: string): void {
  const transcript = document.getElementById('transcript');
  if (!transcript) return;

  const entry = document.createElement('div');
  entry.className = `transcript-entry ${role}`;
  
  const timestamp = document.createElement('span');
  timestamp.className = 'timestamp';
  timestamp.textContent = new Date().toLocaleTimeString();
  
  const roleLabel = document.createElement('span');
  roleLabel.className = 'role';
  roleLabel.textContent = role.toUpperCase() + ':';
  
  const contentSpan = document.createElement('span');
  contentSpan.textContent = content;
  
  entry.appendChild(timestamp);
  entry.appendChild(roleLabel);
  entry.appendChild(contentSpan);
  
  transcript.appendChild(entry);
  transcript.scrollTop = transcript.scrollHeight;
}

export function updateStatus(className: string, text: string): void {
  const statusEl = document.getElementById('status');
  const statusTextEl = document.getElementById('statusText');
  
  if (statusEl) {
    statusEl.className = `status ${className}`;
  }
  
  if (statusTextEl) {
    statusTextEl.textContent = text;
  }
}

// Auto-initialize function
window.initializeVapi = async function(): Promise<void> {
  try {
    updateStatus('loading', 'Initializing...');
    addTranscript('system', 'Starting TypeScript Vapi client initialization...');
    
    const client = new VapiClient();
    
    // Set up event handlers
    client.on('ready', () => {
      addTranscript('system', '✅ Vapi ready! Click the teal phone button to start.');
      updateStatus('ready', 'Ready - Click teal button to call');
    });
    
    client.on('callStart', () => {
      addTranscript('system', '📞 Voice call started');
      updateStatus('active', 'In call');
    });
    
    client.on('callEnd', () => {
      addTranscript('system', '📞 Voice call ended');
      updateStatus('ready', 'Ready - Click teal button to call');
    });
    
    client.on('transcript', (message: TranscriptMessage) => {
      addTranscript(message.role, message.transcript);
    });
    
    client.on('error', (error: any) => {
      addTranscript('system', `❌ Error: ${error.message || JSON.stringify(error)}`);
      updateStatus('error', 'Error occurred');
    });
    
    // Initialize from server
    await client.initializeFromServer();
    
    // Make client available globally
    window.VapiClient = VapiClient;
    
  } catch (error: any) {
    console.error('Failed to initialize:', error);
    addTranscript('system', `❌ Failed to initialize: ${error.message}`);
    updateStatus('error', 'Initialization failed');
  }
};

// Export for use
export default VapiClient;