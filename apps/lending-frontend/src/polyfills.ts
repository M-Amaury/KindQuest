import { Buffer } from 'buffer';
import process from 'process';
import hash from 'hash.js';

if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

(window as any).Buffer = Buffer;
(window as any).process = process;

// Polyfill pour crypto.createHash
if (typeof window !== 'undefined' && !(window as any).crypto) {
  (window as any).crypto = {
    subtle: {
      digest: async (algorithm: string, data: BufferSource) => {
        const hashInstance = hash.sha512();
        const buffer = Buffer.from(data as ArrayBuffer);
        return hashInstance.update(buffer).digest();
      }
    }
  };
} 