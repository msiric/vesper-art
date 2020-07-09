import React, { useContext } from "react";
import { withSnackbar } from "notistack";

const Signup = ({ enqueueSnackbar }) => {
  return (
    <div className={classes.container}>
      <SignupForm />
    </div>
  );
};

export default withSnackbar(Signup);
