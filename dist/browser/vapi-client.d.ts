/**
 * TypeScript Vapi Browser Client
 * This is the main client that will be compiled and bundled for browser use
 */
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
export declare class VapiClient {
    private vapiInstance;
    private publicKey;
    private assistantId;
    private isCallActive;
    private initRetries;
    private maxRetries;
    private callbacks;
    /**
     * Initialize with configuration from server
     */
    initializeFromServer(): Promise<void>;
    /**
     * Initialize the Vapi SDK
     */
    private initialize;
    /**
     * Set up event handlers for Vapi instance
     */
    private setupEventHandlers;
    /**
     * Register event callbacks
     */
    on(event: 'ready' | 'callStart' | 'callEnd' | 'transcript' | 'functionCall' | 'error', callback: any): void;
    /**
     * Check if a call is currently active
     */
    isActive(): boolean;
    /**
     * Get current configuration
     */
    getConfig(): {
        publicKey: string;
        assistantId: string;
    };
}
export declare function addTranscript(role: string, content: string): void;
export declare function updateStatus(className: string, text: string): void;
export default VapiClient;
//# sourceMappingURL=vapi-client.d.ts.map