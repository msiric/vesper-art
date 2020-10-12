import { CircularProgress, Container, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getToken } from "../../services/auth.js";

const VerifyToken = ({ match }) => {
  const history = useHistory();
  const classes = {};

  const verifyToken = async () => {
    try {
      await getToken({ tokenId: match.params.id });
      history.push({
        pathname: "/login",
        state: { message: "Email successfully verified" },
      });
    } catch (err) {
      console.log(err);
      history.push({
        pathname: "/",
        state: { message: "An error occurred" },
      });
    }
  };

  useEffect(() => {
    verifyToken();
  });

  return (
    <Container className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        <Grid item xs={12} className={classes.loader}>
          <CircularProgress />
        </Grid>
      </Grid>
    </Container>
  );
};

export default VerifyToken;
