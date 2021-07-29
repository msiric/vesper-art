import { yupResolver } from "@hookform/resolvers/yup";
import {
  AccountCircleRounded as AccountIcon,
  NotificationsRounded as NotificationsIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { searchValidation } from "../../../../common/validation";
import LogoDesktop from "../../assets/images/logo/logo-desktop.svg";
import SyncButton from "../../components/SyncButton";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import AppBar from "../../domain/AppBar";
import Badge from "../../domain/Badge";
import Box from "../../domain/Box";
import IconButton from "../../domain/IconButton";
import Toolbar from "../../domain/Toolbar";
import SearchForm from "../../forms/SearchForm";
import AccountMenu from "../AccountMenu";
import NotificationMenu from "../NotificationMenu";
import headerStyles from "./styles";

const Header = () => {
  const userId = useUserStore((state) => state.id);
  const authenticated = useUserStore((state) => state.authenticated);
  const toggleMenu = useUserStore((state) => state.toggleMenu);

  const search = useEventsStore((state) => state.search);
  const count = useEventsStore((state) => state.notifications.count);
  const toggleSearch = useEventsStore((state) => state.toggleSearch);
  const toggleNotificationsMenu = useEventsStore((state) => state.toggleMenu);
  const searchQuery = useEventsStore((state) => state.searchQuery);

  const { handleSubmit, errors, control, setValue, getValues } = useForm({
    defaultValues: {
      searchQuery: "",
      searchType: "",
    },
    resolver: yupResolver(searchValidation),
  });

  const history = useHistory();

  const classes = headerStyles();

  useEffect(() => {
    setValue("searchType", search);
  }, [search]);

  return (
    <>
      <AppBar position="static" className={classes.container}>
        <Toolbar className={classes.toolbar}>
          <Box className={classes.wrapper}>
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
              <Box className={classes.actions}>
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
            ) : (
              <Box className={classes.actions}>
                <SyncButton
                  component={RouterLink}
                  variant="text"
                  to="/login"
                  color="default"
                  className={classes.margin}
                >
                  Log in
                </SyncButton>
                <SyncButton
                  component={RouterLink}
                  variant="text"
                  to="/signup"
                  color="primary"
                >
                  Sign up
                </SyncButton>
              </Box>
            )}
          </Box>
          <Box className={classes.searchMobile}>
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
        </Toolbar>
      </AppBar>
      <AccountMenu />
      <NotificationMenu />
    </>
  );
};

export default Header;
