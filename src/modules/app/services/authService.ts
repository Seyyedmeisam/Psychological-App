const BASE = '/auth'

export const authService = {
  register: () => `${BASE}/register`,
  login: () => `${BASE}/login`,
  me: () => `${BASE}/me`,
  logout: () => `${BASE}/logout`,
}
