export const LOGIN_PATH = '/login';
export const DEFAULT_AUTHENTICATED_PATH = '/loado';

export function getSafeRedirectPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== 'string') {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith(LOGIN_PATH)) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  return value;
}
