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
    Component: lazy(() => import('pages/artwork/my_artwork')),
    exact: true,
  },
  {
    path: '/add_artwork',
    Component: lazy(() => import('pages/artwork/add_artwork')),
    exact: true,
  },
  {
    path: '/artwork/:id',
    Component: lazy(() => import('pages/artwork/artwork_details')),
    exact: true,
  },
  {
    path: '/edit_artwork/:id',
    Component: lazy(() => import('pages/artwork/edit_artwork')),
    exact: true,
  },
  // Auth router
  {
    path: '/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  // Conversations router
  {
    path: '/conversations',
    Component: lazy(() => import('pages/conversations/conversations')),
    exact: true,
  },
  // Home router
  {
    path: '/',
    Component: lazy(() => import('pages/home/homepage')),
    exact: true,
  },
  {
    path: '/artwork',
    Component: lazy(() => import('pages/home/artwork')),
    exact: true,
  },
  // Notifications router
  {
    path: '/notifications',
    Component: lazy(() => import('pages/notifications/notifications')),
    exact: true,
  },
  // Checkout router
  {
    path: '/cart',
    Component: lazy(() => import('pages/checkout/cart')),
    exact: true,
  },
  {
    path: '/checkout',
    Component: lazy(() => import('pages/checkout/checkout')),
    exact: true,
  },
  // Order router
  {
    path: '/orders',
    Component: lazy(() => import('pages/orders/orders')),
    exact: true,
  },
  {
    path: '/orders/:id',
    Component: lazy(() => import('pages/orders/order')),
    exact: true,
  },
  // User router
  {
    path: '/user',
    Component: lazy(() => import('pages/user/profile')),
    exact: true,
  },
  {
    path: '/user/settings',
    Component: lazy(() => import('pages/user/settings')),
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
