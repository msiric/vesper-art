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
import LogoItem from "../../components/LogoItem";
import footerStyles from "./styles";

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
                About
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
                    {`What is ${appName}`}
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
                    Reach out
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
          <Grid container className={classes.disclaimers}>
            <Grid item xs={12} sm={6} className={classes.copyright}>
              <LogoItem />
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
