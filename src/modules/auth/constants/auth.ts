export const AUTH_TOKEN_KEY = 'auth_token'

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY)
