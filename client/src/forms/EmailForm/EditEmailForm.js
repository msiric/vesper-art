import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

const EditEmailForm = () => {
  const history = useHistory();

  const classes = useStyles();

  const onSubmit = async (values) => {
    await patchEmail.request({
      userId: store.user.id,
      data: values,
    });

    setState((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        email: values.email,
        verified: false,
      },
    }));
  };
};

return (
  <Box>
    <TextInput
      name="userEmail"
      type="text"
      label="Email address"
      errors={errors}
    />
    <AsyncButton
      type="submit"
      fullWidth
      variant="outlined"
      color="primary"
      padding
      loading={formState.isSubmitting}
    >
      Update
    </AsyncButton>
  </Box>
);

export default EditEmailForm;
