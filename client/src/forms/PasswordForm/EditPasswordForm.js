import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton/index.js";
import { UserContext } from "../../contexts/User.js";
import TextInput from "../../controls/TextInput/index.js";
import { patchPassword } from "../../services/user.js";
import { resetValidation } from "../../validation/reset.js";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

const EditPasswordForm = () => {
  const [userStore, userDispatch] = useContext(UserContext);
  const history = useHistory();

  const classes = useStyles();

  const { handleSubmit, formState, errors, control } = useForm({
    resolver: yupResolver(resetValidation),
  });

  const onSubmit = async (values) => {
    await patchPassword.request({
      userId: userStore.id,
      data: values,
    });
  };

  return (
    <FormProvider control={control}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          name="userCurrent"
          type="password"
          label="Enter current password"
          errors={errors}
        />
        <TextInput
          name="userPassword"
          type="password"
          label="Enter new password"
          errors={errors}
        />
        <TextInput
          name="userConfirm"
          type="password"
          label="Confirm password"
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
      </form>
    </FormProvider>
  );
};

export default EditPasswordForm;
