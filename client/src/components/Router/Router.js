import React, { useContext, lazy, Suspense } from 'react';
import MainLayout from '../../layouts/MainLayout';
import AuthLayout from '../../layouts/AuthLayout';
import { Context } from '../Store/Store';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

const routes = [
  // Artwork router
  {
    path: '/my_artwork',
    Component: lazy(() => import('../Artwork/MyArtwork')),
    exact: true,
  },
  {
    path: '/add_artwork',
    Component: lazy(() => import('../Artwork/AddArtwork')),
    exact: true,
  },
  {
    path: '/artwork/:id',
    Component: lazy(() => import('../Artwork/ArtworkDetails')),
    exact: true,
  },
  {
    path: '/edit_artwork/:id',
    Component: lazy(() => import('../Artwork/EditArtwork')),
    exact: true,
  },
  // Auth router
  {
    path: '/signup',
    Component: lazy(() => import('../Auth/Signup')),
    exact: true,
  },
  {
    path: '/login',
    Component: lazy(() => import('../Auth/Login')),
    exact: true,
  },
  // Conversations router
  {
    path: '/conversations',
    Component: lazy(() => import('../Conversations/Conversations')),
    exact: true,
  },
  // Home router
  {
    path: '/',
    Component: lazy(() => import('../Home/Home')),
    exact: true,
  },
  // Notifications router
  {
    path: '/notifications',
    Component: lazy(() => import('../Notifications/Notifications')),
    exact: true,
  },
  // Checkout router
  {
    path: '/cart',
    Component: lazy(() => import('../Checkout/Cart')),
    exact: true,
  },
  {
    path: '/checkout',
    Component: lazy(() => import('../Checkout/Checkout')),
    exact: true,
  },
  // Orders router
  {
    path: '/orders',
    Component: lazy(() => import('../Orders/Orders')),
    exact: true,
  },
  {
    path: '/orders/:id',
    Component: lazy(() => import('../Orders/Order')),
    exact: true,
  },
  // User router
  {
    path: '/user',
    Component: lazy(() => import('../User/User')),
    exact: true,
  },
  {
    path: '/user/settings',
    Component: lazy(() => import('../User/Settings')),
    exact: true,
  },
];

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Layout === 'login' || Layout === 'signup' ? (
        <AuthLayout>
          <Suspense fallback={null}>
            <Component {...props} />
          </Suspense>
        </AuthLayout>
      ) : (
        <MainLayout>
          <Suspense fallback={null}>
            <Component {...props} />
          </Suspense>
        </MainLayout>
      )
    }
  />
);

const Router = () => {
  const [state] = useContext(Context);
  return (
    <BrowserRouter>
      <Route
        render={(route) => {
          const { location } = route;
          return (
            <Switch location={location}>
              <Route exact path="/" render={() => <Redirect to="/" />} />
              {routes.map(({ path, Component, exact }) => (
                <AppRoute
                  path={path}
                  key={path}
                  exact={exact}
                  layout={path}
                  component={Component}
                />
              ))}
              <Redirect to="/auth/404" />
            </Switch>
          );
        }}
      />
    </BrowserRouter>
  );
};

export default Router;
