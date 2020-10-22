import {
  AppBar,
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
  InputBase,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  AccountBoxRounded as UserIcon,
  AccountCircleRounded as AccountIcon,
  AttachMoneyRounded as SellerIcon,
  BarChartRounded as DashboardIcon,
  ExitToAppRounded as LogoutIcon,
  ImageRounded as ArtworkIcon,
  MoreVertRounded as MoreIcon,
  NotificationsRounded as NotificationsIcon,
  PermIdentityRounded as ProfileIcon,
  SearchRounded as SearchIcon,
  SettingsRounded as SettingsIcon,
  ShoppingBasketRounded as OrdersIcon,
  ViewCarouselRounded as GalleryIcon,
} from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import * as Yup from "yup";
import { EventsContext } from "../../contexts/Events.js";
import { UserContext } from "../../contexts/User.js";
import {
  getNotifications,
  patchRead,
  patchUnread,
  postLogout,
} from "../../services/user.js";
import HeaderStyles from "./Header.style.js";
import NotificationsMenu from "./NotificationsMenu.js";

const searchValidation = Yup.object().shape({
  searchInput: Yup.string().trim().required("Search input is required"),
});

const Header = ({ socket, history }) => {
  const [userStore, userDispatch] = useContext(UserContext);
  const [eventsStore, eventsDispatch] = useContext(EventsContext);
  const [state, setState] = useState({
    profile: { anchorEl: null, mobileAnchorEl: null },
    notifications: {
      anchorEl: null,
      loading: false,
    },
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
    console.log(eventsStore);
    if (
      eventsStore.notifications.items.length < eventsStore.notifications.limit
    ) {
      if (!eventsStore.notifications.opened) {
        setState((prevState) => ({
          ...prevState,
          notifications: {
            ...prevState.notifications,
            anchorEl: target,
            loading: true,
          },
        }));
        try {
          const { data } = await getNotifications.request({
            userId: userStore.id,
            dataCursor: eventsStore.notifications.dataCursor,
            dataCeiling: eventsStore.notifications.dataCeiling,
          });
          eventsDispatch({
            type: "updateNotifications",
            notifications: {
              items: [...eventsStore.notifications.items].concat(
                data.notifications
              ),
              hasMore:
                data.notifications.length <
                eventsStore.notifications.dataCeiling
                  ? false
                  : true,
              dataCursor:
                eventsStore.notifications.dataCursor +
                eventsStore.notifications.dataCeiling,
              opened: true,
            },
          });
        } catch (err) {
          console.log("error");
        } finally {
          setState((prevState) => ({
            ...prevState,
            notifications: { ...prevState.notifications, loading: false },
          }));
        }
      } else {
        setState((prevState) => ({
          ...prevState,
          notifications: {
            ...prevState.notifications,
            anchorEl: target,
            loading: false,
          },
        }));
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        notifications: {
          ...prevState.notifications,
          anchorEl: target,
          loading: false,
        },
      }));
    }
  };

  const handleNotificationsMenuClose = () => {
    setState((prevState) => ({
      ...prevState,
      notifications: {
        ...prevState.notifications,
        anchorEl: null,
        loading: false,
      },
    }));
  };

  const handleLogout = async () => {
    try {
      await postLogout.request();

      userDispatch({
        type: "resetUser",
      });
      eventsDispatch({
        type: "resetEvents",
      });

      socket.disconnect();

      handleMenuClose();

      history.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleReadClick = async (id) => {
    try {
      eventsDispatch({
        type: "notificationSubmitting",
        notifications: {
          isSubmitting: true,
        },
      });
      await patchRead.request({ notificationId: id });
      eventsDispatch({
        type: "updateNotifications",
        notifications: {
          items: eventsStore.notifications.items.map((notification) =>
            notification._id === id
              ? { ...notification, read: true }
              : notification
          ),
          count: eventsStore.notifications.count - 1,
          isSubmitting: false,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnreadClick = async (id) => {
    try {
      eventsDispatch({
        type: "notificationSubmitting",
        notifications: {
          isSubmitting: true,
        },
      });
      await patchUnread.request({ notificationId: id });
      eventsDispatch({
        type: "updateNotifications",
        notifications: {
          items: eventsStore.notifications.items.map((notification) =>
            notification._id === id
              ? { ...notification, read: false }
              : notification
          ),
          count: eventsStore.notifications.count + 1,
          isSubmitting: false,
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
      const { data } = await getNotifications.request({
        userId: userStore.id,
        dataCursor: eventsStore.notifications.dataCursor,
        dataCeiling: eventsStore.notifications.dataCeiling,
      });
      eventsDispatch({
        type: "updateNotifications",
        notifications: {
          items: [...eventsStore.notifications.items].concat(
            data.notifications
          ),
          hasMore:
            data.notifications.length < eventsStore.notifications.dataCeiling
              ? false
              : true,
          dataCursor:
            eventsStore.notifications.dataCursor +
            eventsStore.notifications.dataCeiling,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = () => {
    eventsDispatch({
      type: "updateSearch",
      search: eventsStore.search === "artwork" ? "users" : "artwork",
    });
  };

  const menuId = "primary-search-account-menu";
  const renderProfileMenu = (
    <Menu
      id={menuId}
      open={!!state.profile.anchorEl}
      anchorEl={state.profile.anchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleMenuClose}
      keepMounted
    >
      <Divider />
      {!userStore.stripeId && (
        <>
          <MenuItem component={Link} to="/onboarding" disableRipple>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <SellerIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Become a seller" />
            </ListItem>
          </MenuItem>
          <Divider />
        </>
      )}
      <MenuItem component={Link} to={`/user/${userStore.name}`} disableRipple>
        <ListItemAvatar>
          <Avatar>
            <ProfileIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={userStore.name} />
      </MenuItem>
      <Divider />
      <MenuItem component={Link} to="/dashboard" disableRipple>
        <ListItemAvatar>
          <Avatar>
            <DashboardIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Dashboard" />
      </MenuItem>
      <Divider />
      <MenuItem component={Link} to="/gallery" disableRipple>
        <ListItemAvatar>
          <Avatar>
            <GalleryIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Gallery" />
      </MenuItem>
      <Divider />
      <MenuItem component={Link} to="/my_artwork" disableRipple>
        <ListItemAvatar>
          <Avatar>
            <ArtworkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Artwork" />
      </MenuItem>
      <Divider />
      <MenuItem component={Link} to="/orders" disableRipple>
        <ListItemAvatar>
          <Avatar>
            <OrdersIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Orders" />
      </MenuItem>
      <Divider />
      <MenuItem component={Link} to="/settings" disableRipple>
        <ListItemAvatar>
          <Avatar>
            <SettingsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Settings" />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} disableRipple>
        <ListItemAvatar>
          <Avatar>
            <LogoutIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Log out" />
      </MenuItem>
      <Divider />
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderAuthMobileMenu = (
    <Menu
      id={mobileMenuId}
      open={!!state.profile.mobileAnchorEl}
      anchorEl={state.profile.mobileAnchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleMobileMenuClose}
      keepMounted
    >
      {/*       <MenuItem>
        <IconButton aria-label="Show messages" color="inherit">
          <Badge badgeContent={store.user.messages} color="primary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem> */}
      <MenuItem onClick={handleNotificationsMenuOpen}>
        <IconButton aria-label="Show notifications" color="inherit">
          <Badge badgeContent={eventsStore.notifications.count} color="primary">
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
      id={mobileMenuId}
      open={!!state.profile.mobileAnchorEl}
      anchorEl={state.profile.mobileAnchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleMobileMenuClose}
      keepMounted
    >
      <MenuItem component={Link} variant="outlined" to="/login">
        <p>Log in</p>
      </MenuItem>
      <MenuItem component={Link} variant="outlined" to="/signup">
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
            diagon
          </Typography>
          <Typography
            component={Link}
            to="/"
            className={classes.logoMobile}
            variant="h6"
            noWrap
          >
            d
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
                    `/search?q=${values.searchInput}&t=${eventsStore.search}`
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
                      eventsStore.search === "artwork"
                        ? "Search artwork"
                        : "Search users"
                    }
                    onClick={handleToggle}
                    className={classes.typeIcon}
                    disableFocusRipple
                    disableRipple
                  >
                    {eventsStore.search === "artwork" ? (
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
          {userStore.authenticated ? (
            <>
              <div className={classes.sectionDesktop}>
                {/*                 <IconButton aria-label="Show messages" color="inherit">
                  <Badge badgeContent={store.user.messages} color="primary">
                    <MailIcon />
                  </Badge>
                </IconButton> */}
                <IconButton
                  onClick={handleNotificationsMenuOpen}
                  aria-label="Show notifications"
                  color="inherit"
                >
                  <Badge
                    badgeContent={eventsStore.notifications.count}
                    color="primary"
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
                  <Badge badgeContent={store.user.messages} color="primary">
                    <MailIcon />
                  </Badge>
                </IconButton> */}
                <IconButton
                  onClick={handleNotificationsMenuOpen}
                  aria-label="Show notifications"
                  color="inherit"
                >
                  <Badge
                    badgeContent={eventsStore.notifications.count}
                    color="primary"
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
                <Button
                  component={Link}
                  variant="outlined"
                  to="/login"
                  color="primary"
                  style={{ marginRight: "6px" }}
                >
                  Log in
                </Button>
                <Button
                  component={Link}
                  variant="outlined"
                  to="/signup"
                  color="primary"
                >
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
      {userStore.authenticated ? renderAuthMobileMenu : renderUnauthMobileMenu}
      {renderProfileMenu}
      <NotificationsMenu
        anchorEl={state.notifications.anchorEl}
        loading={state.notifications.loading}
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
