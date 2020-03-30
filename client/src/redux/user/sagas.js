import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { history, store as reduxStore } from 'index'
import { auth } from 'services/auth'
import actions from './actions'
import jwt from 'jsonwebtoken'

export function* LOGIN({ payload }) {
  const { email, password } = payload
  const provider = reduxStore.getState().settings.authProvider
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(auth(provider).login, email, password)
  yield put({
    type: 'user/REFRESH_TOKEN',
  })
  if (success) {
    yield history.push('/')
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in to Clean UI Pro React Admin Template!',
    })
  }
}

export function* REFRESH_TOKEN() {
  const provider = reduxStore.getState().settings.authProvider
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { accessToken } = yield call(auth(provider).refreshToken)
  if (accessToken) {
    const user = jwt.decode(accessToken)
    console.log(user)
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.photo,
        role: 'admin',
        authorized: true,
      },
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  const provider = reduxStore.getState().settings.authProvider
  yield call(auth(provider).logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      name: '',
      role: '',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REFRESH_TOKEN, REFRESH_TOKEN),
    takeEvery(actions.LOGOUT, LOGOUT),
    REFRESH_TOKEN(), // run once on app load to check user auth
  ])
}
