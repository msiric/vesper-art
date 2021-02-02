import { yupResolver } from "@hookform/resolvers/yup";
import {
  AppBar,
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
} from "@material-ui/core";
import {
  AccountCircleRounded as AccountIcon,
  AttachMoneyRounded as SellerIcon,
  BarChartRounded as DashboardIcon,
  ExitToAppRounded as LogoutIcon,
  ImageRounded as ArtworkIcon,
  MoreVertRounded as MoreIcon,
  NotificationsRounded as NotificationsIcon,
  PermIdentityRounded as ProfileIcon,
  SettingsRounded as SettingsIcon,
  ShoppingBasketRounded as OrdersIcon,
  ViewCarouselRounded as GalleryIcon,
} from "@material-ui/icons";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, withRouter } from "react-router-dom";
import * as Yup from "yup";
import LogoDesktop from "../../assets/images/logo/logo-desktop.svg";
import LogoMobile from "../../assets/images/logo/logo-mobile.svg";
import { useTracked as useEventsContext } from "../../contexts/global/events.js";
import { useUserStore } from "../../contexts/global/user.js";
import SearchForm from "../../forms/SearchForm";
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
  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);
  const stripeId = useUserStore((state) => state.stripeId);
  const authenticated = useUserStore((state) => state.authenticated);
  const resetUser = useUserStore((state) => state.resetUser);

  const [eventsStore, eventsDispatch] = useEventsContext();
  const [state, setState] = useState({
    profile: { anchorEl: null, mobileAnchorEl: null },
    notifications: {
      anchorEl: null,
      loading: false,
    },
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      searchInput: "",
    },
    resolver: yupResolver(searchValidation),
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
            userId,
            cursor: eventsStore.notifications.cursor,
            limit: eventsStore.notifications.limit,
          });
          eventsDispatch({
            type: "UPDATE_NOTIFICATIONS",
            notifications: {
              items: [...eventsStore.notifications.items].concat(
                data.notifications
              ),
              hasMore:
                data.notifications.length < eventsStore.notifications.limit
                  ? false
                  : true,
              cursor:
                data.notifications[data.notifications.length - 1] &&
                data.notifications[data.notifications.length - 1].id,
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

      resetUser();
      eventsDispatch({
        type: "RESET_EVENTS",
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
        type: "NOTIFICATION_SUBMITTING",
        notifications: {
          isSubmitting: true,
        },
      });
      await patchRead.request({ notificationId: id });
      eventsDispatch({
        type: "UPDATE_NOTIFICATIONS",
        notifications: {
          items: eventsStore.notifications.items.map((notification) =>
            notification.id === id
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
        type: "NOTIFICATION_SUBMITTING",
        notifications: {
          isSubmitting: true,
        },
      });
      await patchUnread.request({ notificationId: id });
      eventsDispatch({
        type: "UPDATE_NOTIFICATIONS",
        notifications: {
          items: eventsStore.notifications.items.map((notification) =>
            notification.id === id
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
    if (!notification.read) handleReadClick(notification.id);
  };

  const loadMore = async () => {
    try {
      const { data } = await getNotifications.request({
        userId,
        cursor: eventsStore.notifications.cursor,
        limit: eventsStore.notifications.limit,
      });
      eventsDispatch({
        type: "UPDATE_NOTIFICATIONS",
        notifications: {
          items: [...eventsStore.notifications.items].concat(
            data.notifications
          ),
          hasMore:
            data.notifications.length < eventsStore.notifications.limit
              ? false
              : true,
          cursor:
            data.notifications[data.notifications.length - 1] &&
            data.notifications[data.notifications.length - 1].id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = () => {
    eventsDispatch({
      type: "UPDATE_SEARCH",
      search: eventsStore.search === "artwork" ? "users" : "artwork",
    });
  };

  const onSubmit = async (values) => {
    try {
      history.push(`/search?q=${values.searchInput}&t=${eventsStore.search}`);
    } catch (err) {
      console.log(err);
    }
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
      {!stripeId && (
        <>
          <MenuItem component={Link} to="/onboarding" disableRipple>
            <ListItemAvatar>
              <Avatar>
                <SellerIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Become a seller" />
          </MenuItem>
          <Divider />
        </>
      )}
      <MenuItem component={Link} to={`/user/${userUsername}`} disableRipple>
        <ListItemAvatar>
          <Avatar>
            <ProfileIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={userUsername} />
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
          <img
            src={LogoDesktop}
            alt="Logo"
            onClick={() => history.push("/")}
            className={classes.logoDesktop}
          />
          <img
            src={LogoMobile}
            alt="Logo"
            onClick={() => history.push("/")}
            className={classes.logoMobile}
          />
          <div className={classes.search}>
            <FormProvider control={control}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <SearchForm
                  handleToggle={handleToggle}
                  handleSubmit={handleSubmit}
                  getValues={getValues}
                  setValue={setValue}
                  errors={errors}
                />
              </form>
            </FormProvider>
          </div>
          <div className={classes.grow} />
          {authenticated ? (
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
      {authenticated ? renderAuthMobileMenu : renderUnauthMobileMenu}
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
