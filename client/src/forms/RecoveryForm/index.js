import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router-dom";
import TextInput from "../../controls/TextInput";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

const ForgotPasswordForm = ({ errors }) => {
  const history = useHistory();

  const classes = useStyles();

  return (
    <Box>
      <TextInput
        name="userEmail"
        type="text"
        label="Enter your email"
        errors={errors}
      />
    </Box>
  );
};

export default ForgotPasswordForm;
