import { Box, Container, Grid, Link, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { getToken } from "../../services/auth.js";

const VerifyToken = ({ match, location }) => {
  const [state, setState] = useState({ loading: true, error: false });
  const history = useHistory();
  const classes = {};

  const verifyToken = async () => {
    try {
      await getToken.request({ tokenId: match.params.id });
      setState((prevState) => ({ ...prevState, loading: false, error: false }));
      setTimeout(() => {
        history.push({
          pathname: "/login",
          state: { message: "Email successfully verified" },
        });
      }, 3000);
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false, error: true }));
      console.log(err);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <Container key={location.key} className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        <Grid item xs={12} className={classes.loader}>
          {state.loading ? (
            <LoadingSpinner />
          ) : state.error ? (
            <Box>
              <Typography>Token is either invalid or has expired</Typography>
              <Grid container>
                <Grid item xs>
                  <Link
                    component={RouterLink}
                    to="/resend_token"
                    variant="body2"
                  >
                    Resend verification token?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/" variant="body2">
                    Got back to home page
                  </Link>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography>Successfully verified your account</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default VerifyToken;
