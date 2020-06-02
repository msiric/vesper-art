import React, { useState, useContext } from 'react';
import { Context } from '../../components/Store/Store';
import { ax } from '../../shared/Interceptor/Interceptor';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
} from '@material-ui/core';
import {
  AddBoxRounded as AddIcon,
  MenuRounded as MenuIcon,
  SearchRounded as SearchIcon,
  AccountCircleRounded as AccountIcon,
  MailRounded as MailIcon,
  NotificationsRounded as NotificationsIcon,
  MoreVertRounded as MoreIcon,
  ShoppingCartRounded as CartIcon,
  AssessmentRounded as DashboardIcon,
  AssignmentRounded as OrdersIcon,
  FavoriteRounded as SavedIcon,
  SettingsRounded as SettingsIcon,
} from '@material-ui/icons';
import NotificationsMenu from './NotificationsMenu';
import HeaderStyles from './Header.style';

const searchValidation = Yup.object().shape({
  searchInput: Yup.string().trim().required('Search input is required'),
});

const Header = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    profile: { anchorEl: null, mobileAnchorEl: null },
  });

  const history = useHistory();

  const classes = HeaderStyles();

  const {
    setFieldValue,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
  } = useFormik({
    initialValues: {
      searchInput: '',
    },
    searchValidation,
    async onSubmit(values) {
      try {
        history.push(`/search?query=${values.searchInput}&type=artwork`);
      } catch (err) {
        console.log(err);
      }
    },
  });

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
    if (
      !store.user.notifications.items ||
      store.user.notifications.items.length === 0 ||
      store.user.notifications.count !== store.user.notifications.items.length
    ) {
      dispatch({
        type: 'updateNotifications',
        notifications: {
          ...store.user.notifications,
          count: 0,
          loading: true,
        },
      });
      try {
        const { data } = await ax.get(
          `/api/user/${store.user.id}/notifications?cursor=${store.user.notifications.cursor}&ceiling=${store.user.notifications.ceiling}`
        );
        dispatch({
          type: 'updateNotifications',
          notifications: {
            ...store.user.notifications,
            items: data.notifications,
            count: 0,
            hasMore:
              data.notifications.length < store.user.notifications.ceiling
                ? false
                : true,
            cursor:
              store.user.notifications.cursor +
              store.user.notifications.ceiling,
            anchor: e.currentTarget,
            loading: false,
          },
        });
      } catch (err) {
        dispatch({
          type: 'updateNotifications',
          notifications: {
            ...store.user.notifications,
            count: 0,
            anchor: null,
            loading: false,
          },
        });
      }
    } else {
      dispatch({
        type: 'updateNotifications',
        notifications: {
          ...store.user.notifications,
          count: 0,
          anchor: e.currentTarget,
        },
      });
    }
  };

  const handleNotificationsMenuClose = () => {
    dispatch({
      type: 'updateNotifications',
      notifications: {
        ...store.user.notifications,
        count: 0,
        anchor: null,
      },
    });
  };

  const handleLogout = async () => {
    try {
      await ax.post('/api/auth/logout', {
        headers: {
          credentials: 'include',
        },
      });

      dispatch({
        type: 'resetUser',
      });

      handleMenuClose();

      history.push('/login');
    } catch (err) {
      console.log(err);
    }
  };

  const handleReadClick = async (id) => {
    try {
      await ax.patch(`/api/read_notification/${id}`);
      dispatch({
        type: 'updateNotifications',
        notifications: {
          ...store.user.notifications,
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
      await ax.patch(`/api/unread_notification/${id}`);
      dispatch({
        type: 'updateNotifications',
        notifications: {
          ...store.user.notifications,
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

  const loadMore = async () => {
    try {
      dispatch({
        type: 'updateNotifications',
        notifications: {
          ...store.user.notifications,
          count: 0,
          loading: true,
        },
      });
      const { data } = await ax.get(
        `/api/user/${store.user.id}/notifications?cursor=${store.user.notifications.cursor}&ceiling=${store.user.notifications.ceiling}`
      );
      dispatch({
        type: 'updateNotifications',
        notifications: {
          ...store.user.notifications,
          items: [...store.user.notifications.items].concat(data.notifications),
          count: 0,
          hasMore:
            data.notifications.length < store.user.notifications.ceiling
              ? false
              : true,
          cursor:
            store.user.notifications.cursor + store.user.notifications.ceiling,
          loading: false,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderProfileMenu = (
    <Menu
      anchorEl={state.profile.anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderAuthMobileMenu = (
    <Menu
      anchorEl={state.profile.mobileAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
      {/* $CART */}
      {/* <MenuItem component={Link} to="/cart">
        <IconButton aria-label="Show cart" color="inherit">
          <Badge badgeContent={store.user.cartSize} color="secondary">
            <CartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem> */}
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
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            className={classes.title}
            variant="h6"
            noWrap
          >
            Material-UI
          </Typography>
          <div className={classes.search}>
            <form className={classes.form} onSubmit={handleSubmit}>
              <IconButton
                onClick={handleSubmit}
                className={classes.searchIcon}
                disableFocusRipple
                disableRipple
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                name="searchInput"
                type="text"
                value={values.searchInput}
                placeholder="Search…"
                onChange={handleChange}
                onBlur={handleBlur}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </form>
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
                {/* <IconButton
                  component={Link}
                  to="/cart"
                  aria-label="Show cart"
                  color="inherit"
                >
                  <Badge badgeContent={store.user.cartSize} color="secondary">
                    <CartIcon />
                  </Badge>
                </IconButton> */}
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
        handleReadClick={handleReadClick}
        handleUnreadClick={handleUnreadClick}
        loadMore={loadMore}
      />
    </>
  );
};

export default Header;
