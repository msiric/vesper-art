import { JWT_login, JWT_currentAccount, JWT_logout } from './providers/jwt'

export function auth(provider) {
  switch (provider) {
    case 'jwt':
      return {
        login: (email, password) => {
          return JWT_login(email, password)
        },
        currentAccount: () => {
          return JWT_currentAccount()
        },
        logout: () => {
          return JWT_logout()
        },
      }
    default:
      return null
  }
}
