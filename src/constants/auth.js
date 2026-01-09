export const DEFAULT_USERNAME = "admin";
export const DEFAULT_PASSWORD = "1qaz2wsx";
export const TOKEN_STORAGE_KEY = "authToken";

export function createBearerToken(username) {
  return `Bearer ${username}-token`;
}
