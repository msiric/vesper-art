import store from 'store'
import actions from './actions'

const STORED_SETTINGS = storedSettings => {
  const settings = {}
  Object.keys(storedSettings).forEach(key => {
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]
  })
  return settings
}

const initialState = {
  ...STORED_SETTINGS({
    authProvider: 'jwt', // firebase, jwt
    logo: 'Clean UI Pro',
    locale: 'en-US',
    isSidebarOpen: false,
    isSupportChatOpen: false,
    isMobileView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: false,
    menuLayoutType: 'top', // left, top, nomenu
    routerAnimation: 'slide-fadein-up', // none, slide-fadein-up, slide-fadein-right, fadein, zoom-fadein
    menuColor: 'dark', // white, dark, gray
    theme: 'dark', // light, dark
    authPagesColor: 'white', // white, gray, image
    primaryColor: '#ff8000',
    leftMenuWidth: 256,
    isMenuUnfixed: false,
    isMenuShadow: false,
    isTopbarFixed: false,
    isGrayTopbar: false,
    isContentMaxWidth: false,
    isAppMaxWidth: false,
    isGrayBackground: true,
    isCardShadow: true,
    isSquaredBorders: false,
    isBorderless: false,
  }),
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
