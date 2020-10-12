import { Container, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((muiTheme) => ({
  footerContainer: {
    zIndex: 1000,
    padding: muiTheme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor: muiTheme.palette.grey[800],
    textAlign: "center",
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footerContainer}>
      <Container>
        <Typography variant="body2" color="textSecondary">
          {"Copyright © "}
          <Link color="inherit" href="https://material-ui.com/">
            Material UI
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
