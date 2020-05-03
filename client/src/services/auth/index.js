import { JWT_login, JWT_refreshToken, JWT_logout } from './providers/jwt'

export function auth(provider) {
  switch (provider) {
    case 'jwt':
      return {
        login: (email, password) => {
          return JWT_login(email, password)
        },
        refreshToken: () => {
          return JWT_refreshToken()
        },
        logout: () => {
          return JWT_logout()
        },
      }
    default:
      return null
  }
}
