import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { isFormAltered } from "../../../../common/helpers";
import { reviewValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import Fade from "../../domain/Fade";
import Modal from "../../domain/Modal";
import Typography from "../../domain/Typography";
import RatingForm from "../../forms/RatingForm";
import SyncButton from "../SyncButton/index";
import ratingModalStyles from "./styles";

const RatingModal = ({
  open,
  handleConfirm,
  handleClose,
  ariaLabel,
  promptTitle,
  promptConfirm,
  promptCancel,
  loading,
}) => {
  const setDefaultValues = () => ({
    reviewRating: 0,
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    getValues,
    watch,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(reviewValidation),
  });

  const watchedValues = watch();

  const isDisabled =
    !isFormAltered(getValues(), setDefaultValues()) || formState.isSubmitting;

  const classes = ratingModalStyles();

  return (
    <Modal
      aria-labelledby={ariaLabel}
      aria-describedby={ariaLabel}
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={classes.content}>
          <Typography className={classes.title}>{promptTitle}</Typography>
          <Divider />
          <FormProvider control={control}>
            <form onSubmit={handleSubmit(handleConfirm)}>
              <CardContent>
                <RatingForm
                  errors={errors}
                  setValue={setValue}
                  trigger={trigger}
                  getValues={getValues}
                  watch={watch}
                  loading={loading}
                />
              </CardContent>
              <CardActions className={classes.actions}>
                <AsyncButton
                  type="submit"
                  fullWidth
                  padding
                  submitting={formState.isSubmitting}
                  disabled={isDisabled}
                  startIcon={<UploadIcon />}
                >
                  {promptConfirm}
                </AsyncButton>
                <SyncButton type="button" color="dark" onClick={handleClose}>
                  {promptCancel}
                </SyncButton>
              </CardActions>
            </form>
          </FormProvider>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RatingModal;
