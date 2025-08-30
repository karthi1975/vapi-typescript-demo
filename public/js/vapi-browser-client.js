(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VapiBrowserClient"] = factory();
	else
		root["VapiBrowserClient"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!********************************************!*\
  !*** ./src/browser/vapi-browser-client.ts ***!
  \********************************************/

/**
 * TypeScript Vapi Browser Client
 * Properly typed implementation for browser-based Vapi voice operations
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VapiBrowserClient = void 0;
/**
 * Main Vapi Browser Client Class
 */
class VapiBrowserClient {
    vapiInstance = null;
    publicKey;
    assistantId;
    isCallActive = false;
    initRetries = 0;
    maxRetries = 10;
    // Event callbacks
    callbacks = {};
    constructor(publicKey, assistantId) {
        this.publicKey = publicKey;
        this.assistantId = assistantId;
    }
    /**
     * Initialize the Vapi SDK
     */
    async initialize() {
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
                            hideButton: false // Show the teal floating button
                        }
                    });
                    this.setupEventHandlers();
                    console.log('✅ Vapi initialized successfully!');
                    if (this.callbacks.onReady) {
                        this.callbacks.onReady();
                    }
                    resolve();
                }
                catch (error) {
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
    setupEventHandlers() {
        if (!this.vapiInstance)
            return;
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
        this.vapiInstance.on('message', (msg) => {
            if (msg.type === 'transcript' && msg.transcript) {
                const transcriptMessage = {
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
        this.vapiInstance.on('function-call', (event) => {
            console.log('🔧 Function call:', event.functionCall.name);
            if (this.callbacks.onFunctionCall) {
                this.callbacks.onFunctionCall(event);
            }
        });
        this.vapiInstance.on('error', (error) => {
            console.error('❌ Vapi error:', error);
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
        });
    }
    /**
     * Start a voice call
     */
    startCall() {
        if (!this.vapiInstance) {
            throw new Error('Vapi not initialized. Call initialize() first.');
        }
        if (this.vapiInstance.start) {
            this.vapiInstance.start();
        }
        else {
            console.log('Call start requested - Vapi may handle this automatically');
        }
    }
    /**
     * End the current voice call
     */
    endCall() {
        if (!this.vapiInstance) {
            throw new Error('Vapi not initialized');
        }
        if (this.vapiInstance.stop) {
            this.vapiInstance.stop();
        }
        else {
            console.log('Call stop requested');
        }
    }
    /**
     * Send a message to the assistant
     */
    sendMessage(message) {
        if (!this.vapiInstance) {
            throw new Error('Vapi not initialized');
        }
        if (this.vapiInstance.send) {
            this.vapiInstance.send({
                type: 'message',
                content: message
            });
        }
    }
    /**
     * Check if a call is currently active
     */
    isActive() {
        return this.isCallActive;
    }
    /**
     * Register event callbacks
     */
    on(event, callback) {
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
     * Get current configuration
     */
    getConfig() {
        return {
            publicKey: this.publicKey,
            assistantId: this.assistantId
        };
    }
}
exports.VapiBrowserClient = VapiBrowserClient;
// Export for browser use
if (typeof window !== 'undefined') {
    window.VapiBrowserClient = VapiBrowserClient;
}

})();

__webpack_exports__ = __webpack_exports__.VapiBrowserClient;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=vapi-browser-client.js.map