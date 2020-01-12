import {bufferToHex} from "ethereumjs-util";

export function generateSeed(): string {
    const buffer = Buffer.alloc(32);
    const crypto = window.crypto || (window as any).msCrypto;
    crypto.getRandomValues(buffer);
    return bufferToHex(buffer);
}
