export const BASE_URL = Cypress.config('baseUrl');
export const API_URL = Cypress.config('apiUrl');

export function randomString(length) {
  return Math.random()
    .toString(36)
    .substring(length);
}
