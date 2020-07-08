import React, { lazy, Suspense, useEffect, useContext } from "react";
import { Context } from "../../components/Store/Store.js";
import MainLayout from "../../layouts/MainLayout.js";
import AuthLayout from "../../layouts/AuthLayout.js";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

const routes = [
  // Artwork router
  {
    path: "/my_artwork",
    Component: lazy(() => import("../../containers/Artwork/MyArtwork")),
    exact: true,
    type: "protected",
  },
  {
    path: "/add_artwork",
    Component: lazy(() => import("../../containers/Artwork/AddArtwork")),
    exact: true,
    type: "protected",
  },
  {
    path: "/artwork/:id",
    Component: lazy(() => import("../../containers/Artwork/ArtworkDetails")),
    exact: true,
    type: "public",
  },
  {
    path: "/edit_artwork/:id",
    Component: lazy(() => import("../../containers/Artwork/EditArtwork")),
    exact: true,
    type: "protected",
  },
  // Auth router
  {
    path: "/signup",
    Component: lazy(() => import("../../containers/Auth/Signup")),
    exact: true,
    type: "auth",
  },
  {
    path: "/login",
    Component: lazy(() => import("../../containers/Auth/Login")),
    exact: true,
    type: "auth",
  },
  {
    path: "/verify_token/:id",
    Component: lazy(() => import("../../containers/Auth/VerifyToken")),
    exact: true,
    type: "auth",
  },
  {
    path: "/forgot_password",
    Component: lazy(() => import("../../containers/Auth/ForgotPassword")),
    exact: true,
    type: "auth",
  },
  {
    path: "/reset_password/:id",
    Component: lazy(() => import("../../containers/Auth/ResetPassword")),
    exact: true,
    type: "auth",
  },
  // Conversations router
  // {
  //   path: "/conversations",
  //   Component: lazy(() =>
  //     import("../../containers/Conversations/Conversations")
  //   ),
  //   exact: true,
  //   type: "protected",
  // },
  // Home router
  {
    path: "/",
    Component: lazy(() => import("../../containers/Home/Home")),
    exact: true,
    type: "public",
  },
  {
    path: "/verifier",
    Component: lazy(() => import("../../containers/Home/Verifier")),
    exact: true,
    type: "public",
  },
  {
    path: "/search",
    Component: lazy(() => import("../../containers/Home/SearchResults")),
    exact: true,
    type: "public",
  },
  // Notifications router
  // {
  //   path: "/notifications",
  //   Component: lazy(() =>
  //     import("../../containers/Notifications/Notifications")
  //   ),
  //   exact: true,
  //   type: "protected",
  // },
  // $CART
  // Checkout router
  // {
  //   path: '/cart',
  //   Component: lazy(() => import('../../containers/Checkout/Cart')),
  //   exact: true,
  //   type: 'protected',
  // },
  // {
  //   path: '/checkout',
  //   Component: lazy(() => import('../../containers/Checkout/Checkout')),
  //   exact: true,
  //   type: 'protected',
  // },
  {
    path: "/checkout/:id",
    Component: lazy(() => import("../../containers/Checkout/Checkout")),
    exact: true,
    type: "protected",
  },
  // Orders router
  {
    path: "/orders",
    Component: lazy(() => import("../../containers/Orders/Orders")),
    exact: true,
    type: "protected",
  },
  {
    path: "/orders/:id",
    Component: lazy(() => import("../../containers/Orders/Order")),
    exact: true,
    type: "protected",
  },
  // User router
  {
    path: "/user/:id",
    Component: lazy(() => import("../../containers/User/Profile")),
    exact: true,
    type: "public",
  },
  {
    path: "/dashboard",
    Component: lazy(() => import("../../containers/User/Dashboard")),
    exact: true,
    type: "protected",
  },
  {
    path: "/settings",
    Component: lazy(() => import("../../containers/User/Settings")),
    exact: true,
    type: "protected",
  },
  {
    path: "/onboarding",
    Component: lazy(() => import("../../containers/User/Onboarding")),
    exact: true,
    type: "protected",
  },
];

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (rest.type === "auth") {
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
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      } else if (rest.type === "protected") {
        if (!rest.token) {
          return (
            <Redirect
              to={{
                pathname: "/login",
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
            <Component {...props} socket={rest.socket} />
          </Suspense>
        </MainLayout>
      );
    }}
  />
);

const Router = ({ socket }) => {
  const [store, dispatch] = useContext(Context);

  return (
    <BrowserRouter>
      <Route
        render={(route) => {
          const { location } = route;
          return (
            <Switch location={location}>
              {routes.map(({ path, Component, exact, type }) => (
                <AppRoute
                  socket={socket}
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
