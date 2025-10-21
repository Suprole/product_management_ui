export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.ALLOWED_EMAILS || '';
  const list = raw.split(',').map(s => s.trim()).filter(Boolean);
  return list.includes(email);
}


