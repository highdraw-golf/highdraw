export const OWNER_PASSCODES = ['ken2026', 'highdraw2026', 'ken'];

export function isOwnerAuthorized(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const pin = urlParams.get('auth') || urlParams.get('pin') || urlParams.get('owner_pin');
    if (pin && OWNER_PASSCODES.includes(pin.toLowerCase())) {
      sessionStorage.setItem('highdraw_owner_auth', 'true');
      return true;
    }
    return sessionStorage.getItem('highdraw_owner_auth') === 'true';
  } catch {
    return false;
  }
}

export function lockOwnerSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem('highdraw_owner_auth');
  } catch {
    // ignore
  }
}
