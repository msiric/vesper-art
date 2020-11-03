import { Box, Container, Grid, Link, Typography } from "@material-ui/core";
import React from "react";
import footerStyles from "./styles.js";

const Footer = () => {
  const classes = footerStyles();

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
      <Container>
        <Grid container spacing={2} className={classes.footerNav}>
          <Grid item xs={10} sm={6} md={3}>
            <Box className={classes.footerHeading}>Who we are</Box>
            <ul>
              <li>
                <Link to={""}>Home</Link>
              </li>
              <li>
                <Link to={""}>About us</Link>
              </li>
              <li>
                <Link to={""}>How it works</Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={10} sm={6} md={3}>
            <Box className={classes.footerHeading}>Community</Box>
            <ul>
              <li>
                <Link to={""}>Selling on "test"</Link>
              </li>
              <li>
                <Link to={""}>Buying on "test"</Link>
              </li>
              <li>
                <Link to={""}>Trust & safety</Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={10} sm={6} md={3}>
            <Box className={classes.footerHeading}>Support</Box>
            <ul>
              <li>
                <Link to={""}>FAQ &amp; Support</Link>
              </li>
              <li>
                <Link to={""}>Contact Us</Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={10} sm={6} md={3}>
            <Box className={classes.footerHeading}>Connect</Box>
            <ul>
              <li>
                <a
                  className={classes.socialIcon}
                  href="https://www.facebook.com/hifionafinance/"
                  target="_blank"
                >
                  {/* <Facebook /> */}
                </a>
                <a
                  className={classes.socialIcon}
                  href="https://twitter.com/hifionafinance"
                  target="_blank"
                >
                  {/* <Twitter /> */}
                </a>
              </li>
            </ul>
          </Grid>
        </Grid>
        <hr className={classes.hrLight} />
        <Grid container className={classes.disclaimers}>
          <Grid item xs={10} sm={6} className={classes.copyright}>
            <Typography>diagon</Typography>
            <span>Copyright &copy; {new Date().getFullYear()}</span>
          </Grid>
          <Grid item xs={10} sm={6} className={classes.disclosures}>
            <Link to={""}>Privacy Policy</Link>{" "}
            <Link to={""}>Terms of Service</Link>{" "}
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
