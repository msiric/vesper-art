import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import Layout from 'layouts'

const routes = [
  // Auth Pages
  {
    path: '/dashboard/alpha',
    Component: lazy(() => import('pages/dashboard/alpha')),
    exact: true,
  },
  {
    path: '/settings',
    Component: lazy(() => import('pages/settings')),
    exact: true,
  },
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('pages/auth/forgot-password')),
    exact: true,
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('pages/auth/lockscreen')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
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
