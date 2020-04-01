import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import Layout from 'layouts'

const routes = [
  // Artwork router
  {
    path: '/my_artwork',
    Component: lazy(() => import('pages/Artwork/MyArtwork')),
    exact: true,
  },
  {
    path: '/add_artwork',
    Component: lazy(() => import('pages/Artwork/AddArtwork')),
    exact: true,
  },
  {
    path: '/artwork/:id',
    Component: lazy(() => import('pages/Artwork/ArtworkDetails')),
    exact: true,
  },
  {
    path: '/edit_artwork/:id',
    Component: lazy(() => import('pages/Artwork/EditArtwork')),
    exact: true,
  },
  // Auth router
  {
    path: '/signup',
    Component: lazy(() => import('pages/Auth/Signup')),
    exact: true,
  },
  {
    path: '/login',
    Component: lazy(() => import('pages/Auth/Login')),
    exact: true,
  },
  // Conversations router
  {
    path: '/conversations',
    Component: lazy(() => import('pages/Conversations/Conversations')),
    exact: true,
  },
  // Home router
  {
    path: '/',
    Component: lazy(() => import('pages/Home/Home')),
    exact: true,
  },
  // Notifications router
  {
    path: '/notifications',
    Component: lazy(() => import('pages/Notifications/Notifications')),
    exact: true,
  },
  // Checkout router
  {
    path: '/cart',
    Component: lazy(() => import('pages/Checkout/Cart')),
    exact: true,
  },
  {
    path: '/checkout',
    Component: lazy(() => import('pages/Checkout/Checkout')),
    exact: true,
  },
  // Orders router
  {
    path: '/orders',
    Component: lazy(() => import('pages/Orders/Orders')),
    exact: true,
  },
  {
    path: '/orders/:id',
    Component: lazy(() => import('pages/Orders/Order')),
    exact: true,
  },
  // User router
  {
    path: '/user',
    Component: lazy(() => import('pages/User/User')),
    exact: true,
  },
  {
    path: '/user/settings',
    Component: lazy(() => import('pages/User/Settings')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

@connect(mapStateToProps)
class Router extends React.Component {
  render() {
    const { history, routerAnimation } = this.props
    return (
      <ConnectedRouter history={history}>
        <Layout>
          <Route
            render={state => {
              const { location } = state
              return (
                <SwitchTransition>
                  <CSSTransition
                    key={location.pathname}
                    appear
                    classNames={routerAnimation}
                    timeout={routerAnimation === 'none' ? 0 : 300}
                  >
                    <Switch location={location}>
                      <Route exact path="/" render={() => <Redirect to="/dashboard/alpha" />} />
                      {routes.map(({ path, Component, exact }) => (
                        <Route
                          path={path}
                          key={path}
                          exact={exact}
                          render={props => {
                            console.log(location)
                            return (
                              <div className={routerAnimation}>
                                <Suspense fallback={null}>
                                  <Component />
                                </Suspense>
                              </div>
                            )
                          }}
                        />
                      ))}
                      <Redirect to="/auth/404" />
                    </Switch>
                  </CSSTransition>
                </SwitchTransition>
              )
            }}
          />
        </Layout>
      </ConnectedRouter>
    )
  }
}

export default Router
