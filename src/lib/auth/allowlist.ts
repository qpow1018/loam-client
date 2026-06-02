export function isAllowedAuthEmail(email: string | null | undefined) {
  const allowedEmails = process.env.AUTH_ALLOWED_EMAILS?.split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails === undefined || allowedEmails.length === 0) {
    return false;
  }

  return email !== undefined && email !== null && allowedEmails.includes(email.toLowerCase());
}
