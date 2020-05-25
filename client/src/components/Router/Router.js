import React, { lazy, Suspense, useEffect, useContext } from 'react';
import { Context } from '../../components/Store/Store';
import Interceptor from '../../shared/Interceptor/Interceptor';
import MainLayout from '../../layouts/MainLayout';
import AuthLayout from '../../layouts/AuthLayout';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
  useHistory,
} from 'react-router-dom';
import openSocket from 'socket.io-client';
import axios from 'axios';
const ENDPOINT = 'http://localhost:5000';

const routes = [
  // Artwork router
  {
    path: '/my_artwork',
    Component: lazy(() => import('../Artwork/MyArtwork')),
    exact: true,
    type: 'protected',
  },
  {
    path: '/add_artwork',
    Component: lazy(() => import('../Artwork/AddArtwork')),
    exact: true,
    type: 'protected',
  },
  {
    path: '/artwork/:id',
    Component: lazy(() => import('../Artwork/ArtworkDetails')),
    exact: true,
    type: 'public',
  },
  {
    path: '/edit_artwork/:id',
    Component: lazy(() => import('../Artwork/EditArtwork')),
    exact: true,
    type: 'protected',
  },
  // Auth router
  {
    path: '/signup',
    Component: lazy(() => import('../Auth/Signup')),
    exact: true,
    type: 'auth',
  },
  {
    path: '/login',
    Component: lazy(() => import('../Auth/Login')),
    exact: true,
    type: 'auth',
  },
  {
    path: '/verify_token/:id',
    Component: lazy(() => import('../Auth/VerifyToken')),
    exact: true,
    type: 'auth',
  },
  {
    path: '/forgot_password',
    Component: lazy(() => import('../Auth/ForgotPassword')),
    exact: true,
    type: 'auth',
  },
  {
    path: '/reset_password/:id',
    Component: lazy(() => import('../Auth/ResetPassword')),
    exact: true,
    type: 'auth',
  },
  // Conversations router
  {
    path: '/conversations',
    Component: lazy(() => import('../Conversations/Conversations')),
    exact: true,
    type: 'protected',
  },
  // Home router
  {
    path: '/',
    Component: lazy(() => import('../Home/Home')),
    exact: true,
    type: 'public',
  },
  {
    path: '/verifier',
    Component: lazy(() => import('../Home/Verifier')),
    exact: true,
    type: 'public',
  },
  // Notifications router
  {
    path: '/notifications',
    Component: lazy(() => import('../Notifications/Notifications')),
    exact: true,
    type: 'protected',
  },
  // $CART
  // Checkout router
  // {
  //   path: '/cart',
  //   Component: lazy(() => import('../Checkout/Cart')),
  //   exact: true,
  //   type: 'protected',
  // },
  // {
  //   path: '/checkout',
  //   Component: lazy(() => import('../Checkout/Checkout')),
  //   exact: true,
  //   type: 'protected',
  // },
  {
    path: '/checkout/:id',
    Component: lazy(() => import('../Checkout/Checkout')),
    exact: true,
    type: 'protected',
  },
  // Orders router
  {
    path: '/orders',
    Component: lazy(() => import('../Orders/Orders')),
    exact: true,
    type: 'protected',
  },
  {
    path: '/orders/:id',
    Component: lazy(() => import('../Orders/Order')),
    exact: true,
    type: 'protected',
  },
  // User router
  {
    path: '/user/:id',
    Component: lazy(() => import('../User/Profile')),
    exact: true,
    type: 'public',
  },
  {
    path: '/dashboard',
    Component: lazy(() => import('../User/Dashboard')),
    exact: true,
    type: 'protected',
  },
  {
    path: '/settings',
    Component: lazy(() => import('../User/Settings')),
    exact: true,
    type: 'protected',
  },
  {
    path: '/onboarding',
    Component: lazy(() => import('../User/Onboarding')),
    exact: true,
    type: 'protected',
  },
];

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (rest.type === 'auth') {
        if (!rest.token) {
          return (
            <AuthLayout>
              <Suspense fallback={null}>
                <Component {...props} />
              </Suspense>
            </AuthLayout>
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: '/',
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      } else if (rest.type === 'protected') {
        if (!rest.token) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: rest.location,
                },
              }}
            />
          );
        }
      }
      return (
        <MainLayout>
          <Suspense fallback={null}>
            <Component {...props} />
          </Suspense>
        </MainLayout>
      );
    }}
  />
);
const Router = () => {
  const [store, dispatch] = useContext(Context);

  const history = useHistory();

  useEffect(() => {
    const socket = openSocket(ENDPOINT);
    socket.emit('authenticateUser', `Bearer ${store.user.token}`);
    socket.on('sendNotification', (data) => {
      dispatch({
        type: 'updateNotifications',
      });
    });
    socket.on('expiredToken', async () => {
      try {
        const { data } = await axios.post(`/api/auth/refresh_token`, {
          headers: {
            credentials: 'include',
          },
        });
        dispatch({
          type: 'updateUser',
          token: data.accessToken,
          email: data.user.email,
          photo: data.user.photo,
          messages: data.user.messages,
          notifications: data.user.notifications,
          saved: data.user.saved,
          cart: data.user.cart,
          stripeId: data.user.stripeId,
          country: data.user.country,
          cartSize: data.user.cartSize,
        });
        socket.emit('authenticateUser', `Bearer ${data.accessToken}`);
      } catch (err) {
        dispatch({
          type: 'resetUser',
        });
      }
    });
  }, [store.user.authenticated]);
  return (
    <BrowserRouter>
      <Interceptor />
      <Route
        render={(route) => {
          const { location } = route;
          return (
            <Switch location={location}>
              {routes.map(({ path, Component, exact, type }) => (
                <AppRoute
                  token={store.user.token}
                  type={type}
                  path={path}
                  key={path}
                  exact={exact}
                  layout={path}
                  component={Component}
                />
              ))}
              <Redirect to="/404" />
            </Switch>
          );
        }}
      />
    </BrowserRouter>
  );
};
export default Router;
