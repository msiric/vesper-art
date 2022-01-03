import {
  AttachMoneyRounded as SellerIcon,
  BarChartRounded as DashboardIcon,
  ExitToAppRounded as LogoutIcon,
  ImageRounded as ArtworkIcon,
  PermIdentityRounded as ProfileIcon,
  SettingsRounded as SettingsIcon,
  ShoppingBasketRounded as OrdersIcon,
  ViewCarouselRounded as GalleryIcon,
} from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import { featureFlags } from "../../../../common/constants";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import Avatar from "../../domain/Avatar";
import Divider from "../../domain/Divider";
import ListItemAvatar from "../../domain/ListItemAvatar";
import ListItemText from "../../domain/ListItemText";
import Menu from "../../domain/Menu";
import MenuItem from "../../domain/MenuItem";
import { socket } from "../Interceptor";
import HeaderStyles from "./styles";

const AccountMenu = () => {
  const userUsername = useUserStore((state) => state.name);
  const userAnchor = useUserStore((state) => state.anchor);
  const stripeId = useUserStore((state) => state.stripeId);
  const toggleMenu = useUserStore((state) => state.toggleMenu);
  const unauthenticateUser = useUserStore((state) => state.unauthenticateUser);
  const redirectUser = useUserStore((state) => state.redirectUser);
  const resetUser = useUserStore((state) => state.resetUser);

  const resetEvents = useEventsStore((state) => state.resetEvents);

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
      // FEATURE FLAG - dashboard
      hidden: !featureFlags.dashboard,
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

  return (
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
  );
};

export default AccountMenu;
