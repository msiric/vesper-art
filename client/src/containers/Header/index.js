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
  NotificationsRounded as NotificationsIcon,
  PermIdentityRounded as ProfileIcon,
  SettingsRounded as SettingsIcon,
  ShoppingBasketRounded as OrdersIcon,
  ViewCarouselRounded as GalleryIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { searchValidation } from "../../../../common/validation";
import LogoDesktop from "../../assets/images/logo/logo-desktop.svg";
import LogoMobile from "../../assets/images/logo/logo-mobile.svg";
import { useEventsStore } from "../../contexts/global/events.js";
import { useUserStore } from "../../contexts/global/user.js";
import SearchForm from "../../forms/SearchForm";
import { postLogout } from "../../services/user.js";
import { socket } from "../Interceptor/Interceptor";
import NotificationMenu from "../NotificationMenu";
import HeaderStyles from "./styles.js";

/* const AUTH_ITEMS = [
  {
    click: handleNotificationsMenuOpen,
    ariaLabel: "Show notifications",
    showBadge: true,
    badgeValue: notifications.count,
    icon: <NotificationsIcon />,
    label: "Notifications",
  },
  {
    click: handleProfileMenuOpen,
    ariaLabel: "Show profile",
    showBadge: false,
    badgeValue: null,
    icon: <AccountIcon />,
    label: "Profile",
  },
];
const UNAUTH_ITEMS = [
  { redirect: "/login", label: "Login" },
  { redirect: "/signup", label: "Sign up" },
];
const MENU_ITEMS = [
  {
    redirect: "/onboarding",
    icon: <SellerIcon />,
    label: "Become a seller",
    hidden: !!stripeId,
  },
  {
    redirect: `/user/${userUsername}`,
    icon: <ProfileIcon />,
    label: userUsername,
    hidden: false,
  },
  {
    redirect: "/dashboard",
    icon: <DashboardIcon />,
    label: "Dashboard",
    hidden: false,
  },
  {
    redirect: "/gallery",
    icon: <GalleryIcon />,
    label: "Gallery",
    hidden: false,
  },
  {
    redirect: "/my_artwork",
    icon: <ArtworkIcon />,
    label: "My artwork",
    hidden: false,
  },
  {
    redirect: "/orders",
    icon: <OrdersIcon />,
    label: "Orders",
    hidden: false,
  },
  {
    redirect: "/settings",
    icon: <SettingsIcon />,
    label: "Settings",
    hidden: false,
  },
  {
    handleClick: handleLogout,
    icon: <LogoutIcon />,
    label: "Log out",
    hidden: false,
  },
]; */

const Header = () => {
  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);
  const userAnchor = useUserStore((state) => state.anchor);
  const stripeId = useUserStore((state) => state.stripeId);
  const authenticated = useUserStore((state) => state.authenticated);
  const toggleUserMenu = useUserStore((state) => state.toggleMenu);
  const resetUser = useUserStore((state) => state.resetUser);

  const search = useEventsStore((state) => state.search);
  const count = useEventsStore((state) => state.notifications.count);
  const updateSearch = useEventsStore((state) => state.updateSearch);
  const toggleNotificationsMenu = useEventsStore((state) => state.toggleMenu);
  const resetEvents = useEventsStore((state) => state.resetEvents);

  const { handleSubmit, errors, control, setValue, getValues } = useForm({
    defaultValues: {
      searchQuery: "",
      searchType: "",
    },
    resolver: yupResolver(searchValidation),
  });

  const history = useHistory();

  const classes = HeaderStyles();

  const handleLogout = async () => {
    try {
      await postLogout.request();
      socket.instance.emit("disconnectUser");
      resetUser();
      resetEvents();
      toggleUserMenu();

      history.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = () => {
    updateSearch({
      search: search === "artwork" ? "users" : "artwork",
    });
  };

  const onSubmit = async (values) => {
    try {
      if (values.searchQuery.trim()) {
        history.push(`/search?q=${values.searchQuery}&t=${search}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const menuId = "primary-search-account-menu";
  const renderProfileMenu = (
    <Menu
      id={menuId}
      open={!!userAnchor}
      anchorEl={userAnchor}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={toggleUserMenu}
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

  useEffect(() => {
    setValue("searchType", search);
  }, [search]);

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
                  onClick={(e) => toggleNotificationsMenu({ event: e, userId })}
                  aria-label="Show notifications"
                  color="inherit"
                >
                  <Badge badgeContent={count} color="primary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="Show profile"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={(e) => toggleUserMenu({ event: e })}
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
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderProfileMenu}
      <NotificationMenu />
    </>
  );
};

export default Header;
