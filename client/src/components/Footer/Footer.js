import React from 'react';
import { Container, Typography, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((muiTheme) => ({
  footerContainer: {
    padding: muiTheme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      muiTheme.palette.type === 'light'
        ? muiTheme.palette.grey[200]
        : muiTheme.palette.grey[800],
    textAlign: 'center',
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footerContainer}>
      <Container maxWidth="sm">
        <Typography variant="body2" color="textSecondary">
          {'Copyright © '}
          <Link color="inherit" href="https://material-ui.com/">
            Material UI
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
