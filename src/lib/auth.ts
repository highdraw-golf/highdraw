// High Draw Golf — Cryptographic Owner Session Verification
// Uses Web Crypto API (SHA-256) with salted digest verification so no plaintext PINs exist in the JS bundle.

const AUTHORIZED_DIGESTS = new Set([
  '729ae8191cf99466d8796afa10982918761abfceeaf019b33ee6f4e9b468e213',
  '7e9eeedd4d153c6523aed4b7b7fcb588b0c6eeb0095bb6597127545c7376a26f',
  'aef907f45f279065bc44c9a221a0e3fd1bec71a7b529dd3d78c9737e3a6f6f2b',
]);

const SESSION_KEY = 'highdraw_owner_auth_token';
const SESSION_TOKEN_VALUE = 'hd_verified_session_v2';

export async function verifyOwnerPasscode(rawInput: string): Promise<boolean> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) return false;
  try {
    const clean = String(rawInput || '').trim().toLowerCase();
    if (!clean) return false;
    const msgBuffer = new TextEncoder().encode(`highdraw-salt-2026:${clean}`);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (AUTHORIZED_DIGESTS.has(hashHex)) {
      sessionStorage.setItem(SESSION_KEY, SESSION_TOKEN_VALUE);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function isOwnerAuthorized(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === SESSION_TOKEN_VALUE;
  } catch {
    return false;
  }
}

export function lockOwnerSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('highdraw_owner_auth');
  } catch {
    // ignore
  }
}
