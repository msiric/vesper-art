import {
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { appName } from "../../../../common/constants";
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
    <footer className={classes.container}>
      <Toolbar>
        <Container>
          <Grid container className={classes.navigation}>
            <Grid item className={classes.item}>
              <Typography variant="h6" className={classes.heading}>
                Who are we
              </Typography>
              <List>
                <ListItem disableGutters>
                  <Typography
                    className={classes.link}
                    component={RouterLink}
                    to="/"
                  >
                    Home
                  </Typography>
                </ListItem>
                <ListItem disableGutters>
                  <Typography
                    className={classes.link}
                    component={RouterLink}
                    to="/about"
                  >
                    About
                  </Typography>
                </ListItem>
                <ListItem disableGutters>
                  <Typography
                    className={classes.link}
                    component={RouterLink}
                    to="/how_it_works"
                  >
                    How it works
                  </Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item className={classes.item}>
              <Typography variant="h6" className={classes.heading}>
                Community
              </Typography>
              <List>
                <ListItem disableGutters>
                  <Typography
                    className={classes.link}
                    component={RouterLink}
                    to="/start_selling"
                  >{`Selling on ${appName}`}</Typography>
                </ListItem>
                <ListItem disableGutters>
                  <Typography
                    className={classes.link}
                    component={RouterLink}
                    to="/start_buying"
                  >{`Buying on ${appName}`}</Typography>
                </ListItem>
                <ListItem disableGutters>
                  <Typography
                    className={classes.link}
                    component={RouterLink}
                    to="/community_guidelines"
                  >
                    Trust &amp; safety
                  </Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item className={classes.item}>
              <Typography variant="h6" className={classes.heading}>
                Support
              </Typography>
              <List>
                <ListItem disableGutters>
                  <Typography
                    className={classes.link}
                    component={RouterLink}
                    to="/support"
                  >
                    FAQ &amp; support
                  </Typography>
                </ListItem>
                <ListItem disableGutters>
                  <Typography
                    className={classes.link}
                    component={RouterLink}
                    to="/contact"
                  >
                    Contact us
                  </Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item className={classes.item}>
              <Typography variant="h6" className={classes.heading}>
                Connect
              </Typography>
              <List>
                <Typography
                  className={classes.link}
                  component={RouterLink}
                  to=""
                ></Typography>
                <Typography
                  className={classes.link}
                  component={RouterLink}
                  to=""
                ></Typography>
              </List>
            </Grid>
          </Grid>
          <Divider />
          <Grid container className={classes.dislaimers}>
            <Grid item xs={12} sm={6} className={classes.copyright}>
              <img
                src={LogoDesktop}
                alt="Logo"
                onClick={() => history.push("/")}
                className={classes.logo}
              />
              <Typography className={classes.link} component={RouterLink} to="">
                Copyright &copy; {new Date().getFullYear()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.disclosures}>
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
