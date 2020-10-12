import {
  AppBar,
  Badge,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";
import {
  AccountBoxRounded as UserIcon,
  AccountCircleRounded as AccountIcon,
  ImageRounded as ArtworkIcon,
  MoreVertRounded as MoreIcon,
  NotificationsRounded as NotificationsIcon,
  SearchRounded as SearchIcon
} from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import * as Yup from "yup";
import { Context } from "../../context/Store.js";
import {
  getNotifications,
  patchRead,
  patchUnread,
  postLogout
} from "../../services/user.js";
import HeaderStyles from "./Header.style.js";
import NotificationsMenu from "./NotificationsMenu.js";

const searchValidation = Yup.object().shape({
  searchInput: Yup.string().trim().required("Search input is required"),
});

const Header = ({ history }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    profile: { anchorEl: null, mobileAnchorEl: null },
    type: "artwork",
  });

  const classes = HeaderStyles();

  const handleProfileMenuOpen = (e) => {
    setState((prevState) => ({
      ...prevState,
      profile: {
        ...prevState.profile,
        anchorEl: e.currentTarget,
      },
    }));
  };

  const handleMobileMenuClose = () => {
    setState((prevState) => ({
      ...prevState,
      profile: {
        ...prevState.profile,
        mobileAnchorEl: null,
      },
    }));
  };

  const handleMenuClose = () => {
    setState((prevState) => ({
      ...prevState,
      profile: {
        ...prevState.profile,
        anchorEl: null,
      },
    }));
  };

  const handleMobileMenuOpen = (e) => {
    setState((prevState) => ({
      ...prevState,
      profile: {
        ...prevState.profile,
        mobileAnchorEl: e.currentTarget,
      },
    }));
  };

  const handleNotificationsMenuOpen = async (e) => {
    const target = e.currentTarget;
    if (
      store.user.notifications.hasMore &&
      !store.user.notifications.items.length
    ) {
      dispatch({
        type: "updateNotifications",
        notifications: {
          count: 0,
          anchor: target,
          loading: true,
        },
      });
      try {
        const { data } = await getNotifications({
          userId: store.user.id,
          dataCursor: store.user.notifications.dataCursor,
          dataCeiling: store.user.notifications.dataCeiling,
        });
        dispatch({
          type: "updateNotifications",
          notifications: {
            items: data.notifications,
            count: 0,
            hasMore:
              data.notifications.length < store.user.notifications.dataCeiling
                ? false
                : true,
            dataCursor:
              store.user.notifications.dataCursor +
              store.user.notifications.dataCeiling,
            anchor: target,
            loading: false,
          },
        });
      } catch (err) {
        dispatch({
          type: "updateNotifications",
          notifications: {
            count: 0,
            anchor: null,
            loading: false,
          },
        });
      }
    } else {
      dispatch({
        type: "updateNotifications",
        notifications: {
          count: 0,
          anchor: target,
        }
      });
    }
  };

  const handleNotificationsMenuClose = () => {
    dispatch({
      type: "updateNotifications",
      notifications: {
        count: 0,
        anchor: null,
      },
    });
  };

  const handleLogout = async () => {
    try {
      await postLogout();

      dispatch({
        type: "resetUser",
      });

      handleMenuClose();

      history.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleReadClick = async (id) => {
    try {
      await patchRead({ notificationId: id });
      dispatch({
        type: "updateNotifications",
        notifications: {
          items: store.user.notifications.items.map((notification) =>
            notification._id === id
              ? { ...notification, read: true }
              : notification
          ),
          count: -1,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnreadClick = async (id) => {
    try {
      await patchUnread({ notificationId: id });
      dispatch({
        type: "updateNotifications",
        notifications: {
          items: store.user.notifications.items.map((notification) =>
            notification._id === id
              ? { ...notification, read: false }
              : notification
          ),
          count: 1,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRedirectClick = (notification, link) => {
    handleNotificationsMenuClose();
    history.push(link);
    if (!notification.read) handleReadClick(notification._id);
  };

  const loadMore = async () => {
    try {
      dispatch({
        type: "updateNotifications",
        notifications: {
          count: 0,
          loading: true,
        },
      });
      const { data } = await getNotifications({
        userId: store.user.id,
        dataCursor: store.user.notifications.dataCursor,
        dataCeiling: store.user.notifications.dataCeiling,
      });
      dispatch({
        type: "updateNotifications",
        notifications: {
          items: [...store.user.notifications.items].concat(data.notifications),
          count: 0,
          hasMore:
            data.notifications.length < store.user.notifications.dataCeiling
              ? false
              : true,
          dataCursor:
            store.user.notifications.dataCursor +
            store.user.notifications.dataCeiling,
          loading: false,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = () => {
    dispatch({
      type: "setSearch",
      search: store.main.search === "artwork" ? "users" : "artwork",
    });
  };

  const menuId = "primary-search-account-menu";
  const renderProfileMenu = (
    <Menu
      anchorEl={state.profile.anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={!!state.profile.anchorEl}
      onClose={handleMenuClose}
    >
      {!store.user.stripeId && (
        <MenuItem component={Link} to="/onboarding">
          Become a seller
        </MenuItem>
      )}
      <MenuItem component={Link} to={`/user/${store.user.name}`}>
        Profile
      </MenuItem>
      <MenuItem component={Link} to="/dashboard">
        Dashboard
      </MenuItem>
      <MenuItem component={Link} to="/my_artwork">
        Artwork
      </MenuItem>
      <MenuItem component={Link} to="/orders">
        Orders
      </MenuItem>
      <MenuItem component={Link} to="/settings">
        Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderAuthMobileMenu = (
    <Menu
      anchorEl={state.profile.mobileAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={!!state.profile.mobileAnchorEl}
      onClose={handleMobileMenuClose}
    >
      {/*       <MenuItem>
        <IconButton aria-label="Show messages" color="inherit">
          <Badge badgeContent={store.user.messages} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem> */}
      <MenuItem onClick={handleNotificationsMenuOpen}>
        <IconButton aria-label="Show notifications" color="inherit">
          <Badge
            badgeContent={store.user.notifications.count}
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="Show profile"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const renderUnauthMobileMenu = (
    <Menu
      anchorEl={state.profile.mobileAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={!!state.profile.mobileAnchorEl}
      onClose={handleMobileMenuClose}
    >
      <MenuItem component={Link} to="/login">
        <p>Log in</p>
      </MenuItem>
      <MenuItem component={Link} to="/signup">
        <p>Sign up</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="static" className={classes.headerContainer}>
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            className={classes.logoDesktop}
            variant="h6"
            noWrap
          >
            Material-UI
          </Typography>
          <Typography
            component={Link}
            to="/"
            className={classes.logoMobile}
            variant="h6"
            noWrap
          >
            UI
          </Typography>
          <div className={classes.search}>
            <Formik
              initialValues={{
                searchInput: "",
              }}
              validationSchema={searchValidation}
              onSubmit={async (values, { resetForm }) => {
                try {
                  history.push(
                    `/search?q=${values.searchInput}&t=${store.main.search}`
                  );
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {({ values, errors, touched, isSubmitting, handleSubmit }) => (
                <Form className={classes.card}>
                  <IconButton
                    title={
                      store.main.search === "artwork"
                        ? "Search artwork"
                        : "Search users"
                    }
                    onClick={handleToggle}
                    className={classes.typeIcon}
                    disableFocusRipple
                    disableRipple
                  >
                    {store.main.search === "artwork" ? (
                      <ArtworkIcon />
                    ) : (
                      <UserIcon />
                    )}
                  </IconButton>
                  <Field name="searchInput">
                    {({ field, form, meta }) => (
                      <InputBase
                        {...field}
                        type="text"
                        placeholder="Search…"
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                        inputProps={{ "aria-label": "search" }}
                      />
                    )}
                  </Field>
                  <IconButton
                    onClick={handleSubmit}
                    className={classes.searchIcon}
                    disableFocusRipple
                    disableRipple
                  >
                    <SearchIcon />
                  </IconButton>
                </Form>
              )}
            </Formik>
          </div>
          <div className={classes.grow} />
          {store.user.authenticated ? (
            <>
              <div className={classes.sectionDesktop}>
                {/*                 <IconButton aria-label="Show messages" color="inherit">
                  <Badge badgeContent={store.user.messages} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton> */}
                <IconButton
                  onClick={handleNotificationsMenuOpen}
                  aria-label="Show notifications"
                  color="inherit"
                >
                  <Badge
                    badgeContent={store.user.notifications.count}
                    color="secondary"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="Show profile"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountIcon />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                {/*                 <IconButton aria-label="Show messages" color="inherit">
                  <Badge badgeContent={store.user.messages} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton> */}
                <IconButton
                  onClick={handleNotificationsMenuOpen}
                  aria-label="Show notifications"
                  color="inherit"
                >
                  <Badge
                    badgeContent={store.user.notifications.count}
                    color="secondary"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="Show profile"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountIcon />
                </IconButton>
              </div>
            </>
          ) : (
            <>
              <div className={classes.sectionDesktop}>
                <Button component={Link} to="/login" color="default">
                  Log in
                </Button>
                <Button component={Link} to="/signup" color="secondary">
                  Sign up
                </Button>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="Show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
      {store.user.authenticated ? renderAuthMobileMenu : renderUnauthMobileMenu}
      {renderProfileMenu}
      <NotificationsMenu
        notifications={store.user.notifications}
        handleNotificationsMenuClose={handleNotificationsMenuClose}
        handleRedirectClick={handleRedirectClick}
        handleReadClick={handleReadClick}
        handleUnreadClick={handleUnreadClick}
        loadMore={loadMore}
      />
    </>
  );
};

export default withRouter(Header);
