import ejsutil from 'ethereumjs-util';

export function generateSeed(): string {
    const buffer = new Buffer(32);
    const crypto = window.crypto || (window as any).msCrypto;
    crypto.getRandomValues(buffer);
    return ejsutil.bufferToHex(buffer);
}
