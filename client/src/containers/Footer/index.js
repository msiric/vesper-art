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
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Reddit as RedditIcon,
  Twitter as TwitterIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { appName } from "../../../../common/constants";
import { socialLinks } from "../../common/constants";
import LogoItem from "../../components/LogoItem";
import IconButton from "../../domain/IconButton";
import footerStyles from "./styles";

const Footer = () => {
  const classes = footerStyles();

  const history = useHistory();

  return (
    <footer className={classes.container}>
      <Toolbar disableGutters>
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
                <ListItem disableGutters>
                  <Typography
                    className={classes.link}
                    component={RouterLink}
                    to="/license_information"
                  >
                    License information
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
                    to="/faq"
                  >
                    FAQ
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
                <IconButton
                  aria-label="Facebook"
                  href={socialLinks.facebook}
                  className={classes.button}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  aria-label="Instagram"
                  href={socialLinks.instagram}
                  className={classes.button}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  aria-label="Twitter"
                  href={socialLinks.twitter}
                  className={classes.button}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  aria-label="Reddit"
                  href={socialLinks.reddit}
                  className={classes.button}
                >
                  <RedditIcon />
                </IconButton>
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
              <Link component={RouterLink} to="/privacy_policy">
                Privacy Policy
              </Link>
              <Link component={RouterLink} to={"/terms_of_service"}>
                Terms of Service
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </footer>
  );
};

export default Footer;
