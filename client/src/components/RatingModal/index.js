import { yupResolver } from "@hookform/resolvers/yup";
import {
  ArrowUpwardRounded as SubmitIcon,
  CloseRounded as CloseIcon,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { reviewValidation } from "../../../../common/validation";
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import Divider from "../../domain/Divider";
import Fade from "../../domain/Fade";
import Modal from "../../domain/Modal";
import Typography from "../../domain/Typography";
import RatingForm from "../../forms/RatingForm";
import { isFormDisabled } from "../../utils/helpers";
import AsyncButton from "../AsyncButton/index";
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

  watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

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
              <Box className={classes.rating}>
                <RatingForm
                  errors={errors}
                  setValue={setValue}
                  trigger={trigger}
                  getValues={getValues}
                  watch={watch}
                  loading={loading}
                />
              </Box>
              <Box className={classes.actions}>
                <AsyncButton
                  type="submit"
                  color="secondary"
                  fullWidth
                  submitting={formState.isSubmitting}
                  disabled={isDisabled}
                  startIcon={<SubmitIcon />}
                >
                  {promptConfirm}
                </AsyncButton>
                <SyncButton
                  type="button"
                  onClick={handleClose}
                  startIcon={<CloseIcon />}
                >
                  {promptCancel}
                </SyncButton>
              </Box>
            </form>
          </FormProvider>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RatingModal;
