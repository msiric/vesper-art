import store from 'store'

const FAKE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRoZW9ybml0aG9sb2dpc3QiLCJzdXJuYW1lIjoiQm9uZCIsIm5hbWUiOiJKYW1lcyBCb25kIiwiaWF0Ijo5NDY2ODQ4MDB9.uOP6fIf8dhgb7As5D0a4z6EjaXsudQgrKWj8PmoWFd0'
const FAKE_USERS = [
  {
    uid: 36254,
    email: 'admin@mediatec.org',
    avatar: '',
    password: 'cleanui',
  },
]

const fake_fetch = (url, params) => {
  switch (url) {
    case 'api/login':
      return new Promise((resolve, reject) => {
        resolve({
          headers: '',
          jwt: FAKE_JWT,
          data: FAKE_USERS[0],
        })
      })
    case 'api/currentUser':
      return new Promise((resolve, reject) => {
        resolve({
          headers: '',
          jwt: FAKE_JWT,
          data: FAKE_USERS[0],
        })
      })
    case 'api/logout':
      return new Promise((resolve, reject) => {
        resolve(true)
      })
    default:
      return null
  }
}

export async function JWT_login(email, password) {
  const user = {
    email,
    password,
  }
  const token = store.get('jwt.token')
  const response = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
      headers: {
        authorization: token ? `bearer ${token}` : '',
      },
    },
    body: JSON.stringify(user),
  })
  const { accessToken } = await response.json()
  store.set('jwt.token', accessToken)
}

export async function JWT_currentAccount() {
  const jwt = store.get('jwt.token')
  return (
    fake_fetch('api/currentUser', {
      // replace this with real fetch() method
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ jwt }),
    })
      // .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          return false
        } else {
          return data.data
        }
      })
  )
}

export async function JWT_logout() {
  const jwt = store.get('jwt.token')
  return (
    fake_fetch('api/logout', {
      // replace this with real fetch() method
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ jwt }),
    })
      // .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          return false
        } else {
          store.remove('jwt.token')
          return true
        }
      })
  )
}
