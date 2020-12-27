import React, { lazy, Suspense } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { useTracked as useUserContext } from "../../contexts/User.js";
import AuthLayout from "../../layouts/AuthLayout.js";
import MainLayout from "../../layouts/MainLayout.js";
import history from "../../utils/history.js";

const routes = [
  // Artwork router
  {
    path: "/my_artwork",
    Component: lazy(() => import("../../pages/Artwork/MyArtwork")),
    exact: true,
    type: "protected",
  },
  {
    path: "/artwork/add",
    Component: lazy(() => import("../../pages/Artwork/AddArtwork")),
    exact: true,
    type: "protected",
  },
  {
    path: "/artwork/:id",
    Component: lazy(() => import("../../pages/Artwork/ArtworkDetails")),
    exact: true,
    type: "public",
  },
  {
    path: "/artwork/:id/edit",
    Component: lazy(() => import("../../pages/Artwork/EditArtwork")),
    exact: true,
    type: "protected",
  },
  // Auth router
  {
    path: "/signup",
    Component: lazy(() => import("../../pages/Auth/Signup")),
    exact: true,
    type: "auth",
  },
  {
    path: "/login",
    Component: lazy(() => import("../../pages/Auth/Login")),
    exact: true,
    type: "auth",
  },
  {
    path: "/verify_token/:id",
    Component: lazy(() => import("../../pages/Auth/VerifyToken")),
    exact: true,
    type: "auth",
  },
  {
    path: "/forgot_password",
    Component: lazy(() => import("../../pages/Auth/ForgotPassword")),
    exact: true,
    type: "auth",
  },
  {
    path: "/reset_password/:id",
    Component: lazy(() => import("../../pages/Auth/ResetPassword")),
    exact: true,
    type: "auth",
  },
  // Conversations router
  // {
  //   path: "/conversations",
  //   Component: lazy(() =>
  //     import("../../pages/Conversations/Conversations")
  //   ),
  //   exact: true,
  //   type: "protected",
  // },
  // Home router
  {
    path: "/",
    Component: lazy(() => import("../../pages/Home/Home")),
    exact: true,
    type: "public",
  },
  {
    path: "/verifier",
    Component: lazy(() => import("../../pages/Home/Verifier")),
    exact: true,
    type: "public",
  },
  {
    path: "/search",
    Component: lazy(() => import("../../pages/Home/SearchResults")),
    exact: true,
    type: "public",
  },
  {
    path: "/how_it_works",
    Component: lazy(() => import("../../pages/Home/HowItWorks")),
    exact: true,
    type: "public",
  },
  // Community router
  {
    path: "/start_selling",
    Component: lazy(() => import("../../pages/Community/Selling")),
    exact: true,
    type: "public",
  },
  {
    path: "/start_buying",
    Component: lazy(() => import("../../pages/Community/Buying")),
    exact: true,
    type: "public",
  },
  {
    path: "/community_guidelines",
    Component: lazy(() => import("../../pages/Community/Safety")),
    exact: true,
    type: "public",
  },
  // Notifications router
  // {
  //   path: "/notifications",
  //   Component: lazy(() =>
  //     import("../../pages/Notifications/Notifications")
  //   ),
  //   exact: true,
  //   type: "protected",
  // },
  // $CART
  // Checkout router
  // {
  //   path: '/cart',
  //   Component: lazy(() => import('../../pages/Checkout/Cart')),
  //   exact: true,
  //   type: 'protected',
  // },
  // {
  //   path: '/checkout',
  //   Component: lazy(() => import('../../pages/Checkout/Checkout')),
  //   exact: true,
  //   type: 'protected',
  // },
  {
    path: "/checkout/:id",
    Component: lazy(() => import("../../pages/Checkout/Checkout")),
    exact: true,
    type: "protected",
  },
  // Orders router
  {
    path: "/orders",
    Component: lazy(() => import("../../pages/Orders/Orders")),
    exact: true,
    type: "protected",
  },
  {
    path: "/orders/:id",
    Component: lazy(() => import("../../pages/Orders/Order")),
    exact: true,
    type: "protected",
  },
  // User router
  {
    path: "/user/:id",
    Component: lazy(() => import("../../pages/User/Profile")),
    exact: true,
    type: "public",
  },
  {
    path: "/gallery",
    Component: lazy(() => import("../../pages/User/Gallery")),
    exact: true,
    type: "protected",
  },
  {
    path: "/dashboard",
    Component: lazy(() => import("../../pages/User/Dashboard")),
    exact: true,
    type: "protected",
  },
  {
    path: "/settings",
    Component: lazy(() => import("../../pages/User/Settings")),
    exact: true,
    type: "protected",
  },
  {
    path: "/onboarding",
    Component: lazy(() => import("../../pages/User/Onboarding")),
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
              <Suspense fallback={<LoadingSpinner />}>
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
        <MainLayout socket={rest.socket}>
          <Suspense fallback={<LoadingSpinner />}>
            <Component {...props} socket={rest.socket} />
          </Suspense>
        </MainLayout>
      );
    }}
  />
);

const AppRouter = ({ socket }) => {
  const [userStore] = useUserContext();

  return (
    <Router history={history}>
      <Route
        render={(route) => {
          const { location } = route;
          return (
            <Switch location={location}>
              {routes.map(({ path, Component, exact, type }) => (
                <AppRoute
                  socket={socket}
                  token={userStore.token}
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
    </Router>
  );
};
export default AppRouter;
