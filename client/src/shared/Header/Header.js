import React, { useState, useContext } from 'react';
import ax from '../../axios.config';
import { useHistory } from 'react-router-dom';
import { Context } from '../../components/Store/Store';
import { Link } from 'react-router-dom';
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
import HeaderStyles from './Header.style';

const Header = () => {
  const [store, dispatch] = useContext(Context);
  const history = useHistory();

  const classes = HeaderStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    const { data } = await ax.post('/api/auth/logout', {
      headers: {
        credentials: 'include',
      },
    });
    window.accessToken = data.accessToken;
    handleMenuClose();
    history.push('/login');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={Link} to={`/user/${store.user.name}`}>
        Profile
      </MenuItem>
      <MenuItem component={Link} to="/onboarding">
        Become a seller
      </MenuItem>
      <MenuItem component={Link} to="/dashboard">
        Dashboard
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
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem component={Link} to="/add_artwork">
        <IconButton color="inherit">
          <AddIcon />
        </IconButton>
        <p>Add artwork</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="Show messages" color="inherit">
          <Badge badgeContent={store.user.messages} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="Show notifications" color="inherit">
          <Badge badgeContent={store.user.notifications} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem component={Link} to="/cart">
        <IconButton aria-label="Show cart" color="inherit">
          <Badge badgeContent={store.user.cartSize} color="secondary">
            <CartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
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
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
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
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          {store.user.authenticated ? (
            <>
              <div className={classes.sectionDesktop}>
                <IconButton component={Link} to="/add_artwork" color="inherit">
                  <AddIcon />
                </IconButton>
                <IconButton aria-label="Show messages" color="inherit">
                  <Badge badgeContent={store.user.messages} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton aria-label="Show notifications" color="inherit">
                  <Badge
                    badgeContent={store.user.notifications}
                    color="secondary"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  component={Link}
                  to="/cart"
                  aria-label="Show cart"
                  color="inherit"
                >
                  <Badge badgeContent={store.user.cartSize} color="secondary">
                    <CartIcon />
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
      {renderMenu}
    </>
  );
};

export default Header;
