import {
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import LogoDesktop from "../../assets/images/logo/logo-desktop.svg";
import footerStyles from "./styles.js";

const Footer = () => {
  const classes = footerStyles();

  const history = useHistory();

  return (
    // old
    // <footer className={classes.footerContainer}>
    //   <Container>
    //     <Typography variant="body2" color="textSecondary">
    //       {"Copyright © "}
    //       <Link color="inherit" href="https://material-ui.com/">
    //         Material UI
    //       </Link>{" "}
    //       {new Date().getFullYear()}
    //       {"."}
    //     </Typography>
    //   </Container>
    // </footer>
    <footer className={classes.footerContainer}>
      <Toolbar>
        <Container>
          <Grid container className={classes.footerNav}>
            <Grid item xs={12} sm={6} md={3} className={classes.footerItem}>
              <Typography variant="h6" className={classes.footerHeading}>
                Who are we
              </Typography>
              <List>
                <ListItem disableGutters>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="About us" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="How it works" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.footerItem}>
              <Typography variant="h6" className={classes.footerHeading}>
                Community
              </Typography>
              <List>
                <ListItem disableGutters>
                  <ListItemText primary="Selling on test" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="Buying on test" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="Trust &amp; safety" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.footerItem}>
              <Typography variant="h6" className={classes.footerHeading}>
                Support
              </Typography>
              <List>
                <ListItem disableGutters>
                  <ListItemText primary="FAQ &amp; support" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="Contact us" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.footerItem}>
              <Typography variant="h6" className={classes.footerHeading}>
                Connect
              </Typography>
              <List>
                <ListItem disableGutters></ListItem>
                <ListItem disableGutters></ListItem>
              </List>
            </Grid>
          </Grid>
          <Divider />
          <Grid container className={classes.footerDisclaimers}>
            <Grid item xs={12} sm={6} className={classes.footerCopyright}>
              <img
                src={LogoDesktop}
                alt="Logo"
                onClick={() => history.push("/")}
                className={classes.logoDesktop}
              />
              <Typography>
                Copyright &copy; {new Date().getFullYear()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.footerDisclosures}>
              <Link to={""}>Privacy Policy</Link>{" "}
              <Link to={""}>Terms of Service</Link>{" "}
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </footer>
  );
};

export default Footer;
