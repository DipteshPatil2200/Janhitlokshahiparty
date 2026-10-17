// =============================================================
// CLIENT-SIDE FORM VALIDATION HELPERS
// =============================================================

export function isValidMobile(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
