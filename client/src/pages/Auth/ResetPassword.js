import React from "react";
import ResetPasswordForm from "../../containers/Auth/ResetPasswordForm.js";

const ResetPassword = ({ match }) => {
  return (
    <div className={classes.container}>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
