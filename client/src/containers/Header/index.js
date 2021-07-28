import { yupResolver } from "@hookform/resolvers/yup";
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
import { featureFlags } from "../../../../common/constants";
import { searchValidation } from "../../../../common/validation";
import LogoDesktop from "../../assets/images/logo/logo-desktop.svg";
import SyncButton from "../../components/SyncButton";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import AppBar from "../../domain/AppBar";
import Avatar from "../../domain/Avatar";
import Badge from "../../domain/Badge";
import Box from "../../domain/Box";
import Divider from "../../domain/Divider";
import IconButton from "../../domain/IconButton";
import ListItemAvatar from "../../domain/ListItemAvatar";
import ListItemText from "../../domain/ListItemText";
import Menu from "../../domain/Menu";
import MenuItem from "../../domain/MenuItem";
import Toolbar from "../../domain/Toolbar";
import SearchForm from "../../forms/SearchForm";
import { socket } from "../Interceptor/indexx";
import NotificationMenu from "../NotificationMenu";
import HeaderStyles from "./styles";

const Header = () => {
  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);
  const userAnchor = useUserStore((state) => state.anchor);
  const stripeId = useUserStore((state) => state.stripeId);
  const authenticated = useUserStore((state) => state.authenticated);
  const toggleMenu = useUserStore((state) => state.toggleMenu);
  const unauthenticateUser = useUserStore((state) => state.unauthenticateUser);
  const redirectUser = useUserStore((state) => state.redirectUser);
  const resetUser = useUserStore((state) => state.resetUser);

  const search = useEventsStore((state) => state.search);
  const count = useEventsStore((state) => state.notifications.count);
  const toggleSearch = useEventsStore((state) => state.toggleSearch);
  const toggleNotificationsMenu = useEventsStore((state) => state.toggleMenu);
  const searchQuery = useEventsStore((state) => state.searchQuery);
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

  const menuItems = [
    {
      handleClick: (e) =>
        redirectUser({
          event: e,
          link: "/onboarding",
          toggleMenu,
          history,
        }),
      icon: <SellerIcon />,
      label: "Become a seller",
      // FEATURE FLAG - stripe
      hidden: !!stripeId || !featureFlags.stripe,
    },
    {
      handleClick: (e) =>
        redirectUser({
          event: e,
          link: `/user/${userUsername}`,
          toggleMenu,
          history,
        }),
      icon: <ProfileIcon />,
      label: userUsername,
      hidden: false,
    },
    {
      handleClick: (e) =>
        redirectUser({ event: e, link: "/dashboard", toggleMenu, history }),
      icon: <DashboardIcon />,
      label: "Dashboard",
      hidden: false,
    },
    {
      handleClick: (e) =>
        redirectUser({ event: e, link: "/gallery", toggleMenu, history }),
      icon: <GalleryIcon />,
      label: "Gallery",
      hidden: false,
    },
    {
      handleClick: (e) =>
        redirectUser({
          event: e,
          link: "/my_artwork",
          toggleMenu,
          history,
        }),
      icon: <ArtworkIcon />,
      label: "My artwork",
      hidden: false,
    },
    {
      handleClick: (e) =>
        redirectUser({ event: e, link: "/orders", toggleMenu, history }),
      icon: <OrdersIcon />,
      label: "Orders",
      hidden: false,
    },
    {
      handleClick: (e) =>
        redirectUser({ event: e, link: "/settings", toggleMenu, history }),
      icon: <SettingsIcon />,
      label: "Settings",
      hidden: false,
    },
    {
      handleClick: () =>
        unauthenticateUser({
          socket,
          resetUser,
          resetEvents,
          toggleMenu,
          history,
        }),
      icon: <LogoutIcon />,
      label: "Log out",
      hidden: false,
    },
  ];

  useEffect(() => {
    setValue("searchType", search);
  }, [search]);

  return (
    <>
      <AppBar position="static" className={classes.container}>
        <Toolbar>
          <img
            src={LogoDesktop}
            alt="Logo"
            onClick={() => history.push("/")}
            className={classes.logo}
          />
          <Box className={classes.search}>
            <FormProvider control={control}>
              <form
                onSubmit={handleSubmit((values) =>
                  searchQuery({ values, history })
                )}
              >
                <SearchForm
                  handleToggle={toggleSearch}
                  handleSubmit={handleSubmit}
                  getValues={getValues}
                  setValue={setValue}
                  errors={errors}
                />
              </form>
            </FormProvider>
          </Box>
          <Box className={classes.grow} />
          {authenticated ? (
            <>
              <Box className={classes.wrapper}>
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
                  aria-haspopup="true"
                  onClick={(e) => toggleMenu({ event: e })}
                  color="inherit"
                >
                  <AccountIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Box className={classes.wrapper}>
                <SyncButton
                  component={Link}
                  variant="outlined"
                  to="/login"
                  color="primary"
                  className={classes.margin}
                >
                  Log in
                </SyncButton>
                <SyncButton
                  component={Link}
                  variant="outlined"
                  to="/signup"
                  color="primary"
                >
                  Sign up
                </SyncButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Menu
        open={!!userAnchor}
        anchorEl={userAnchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={toggleMenu}
      >
        <Divider />
        {menuItems.map(
          (item) =>
            !item.hidden && (
              <>
                <MenuItem onClick={item.handleClick} disableRipple>
                  <ListItemAvatar>
                    <Avatar>{item.icon}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.label} />
                </MenuItem>
                <Divider />
              </>
            )
        )}
      </Menu>
      <NotificationMenu />
    </>
  );
};

export default Header;
