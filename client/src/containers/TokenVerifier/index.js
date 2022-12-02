import React, { useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import { useUserToken } from "../../contexts/local/userToken";
import Box from "../../domain/Box";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";

const TokenVerifier = ({ paramId }) => {
  const loading = useUserToken((state) => state.token.loading);
  const error = useUserToken((state) => state.token.error);
  const fetchToken = useUserToken((state) => state.fetchToken);

  const history = useHistory();

  const handleTokenVerification = async () => {
    try {
      await fetchToken({ tokenId: paramId });
      history.push({
        pathname: "/login",
        state: { message: "Email successfully verified" },
      });
    } catch (err) {
      // do nothing
    }
  };

  useEffect(() => {
    handleTokenVerification();
  }, []);

  return loading ? (
    <LoadingSpinner />
  ) : error ? (
    <Box>
      <Typography>Token is either invalid or has expired</Typography>
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to="/resend_token" variant="body2">
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
  );
};

export default TokenVerifier;
