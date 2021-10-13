import { yupResolver } from "@hookform/resolvers/yup";
import { AssignmentTurnedInOutlined as VerifyIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { isFormAltered } from "../../../../common/helpers";
import { fingerprintValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import VerifierForm from "../../forms/VerifierForm/index";
import verifierCardStyles from "./styles";

const VerifierCard = () => {
  const license = useLicenseVerifier((state) => state.license.data);
  const loading = useLicenseVerifier((state) => state.license.loading);
  const fetchLicense = useLicenseVerifier((state) => state.fetchLicense);

  const classes = verifierCardStyles();

  const setDefaultValues = () => ({
    licenseFingerprint: "",
    assigneeIdentifier: "",
    assignorIdentifier: "",
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
    reset,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(fingerprintValidation),
  });

  const watchedValues = watch();

  const isDisabled =
    !isFormAltered(getValues(), setDefaultValues()) || formState.isSubmitting;

  useEffect(() => {
    reset(setDefaultValues());
  }, [license]);

  return (
    <Card>
      <FormProvider control={control}>
        <form
          onSubmit={handleSubmit(
            async () => await fetchLicense({ licenseData: getValues() })
          )}
        >
          <CardContent>
            <VerifierForm errors={errors} loading={loading} />
          </CardContent>
          <CardActions className={classes.actions}>
            <AsyncButton
              type="submit"
              fullWidth
              padding
              submitting={formState.isSubmitting}
              disabled={isDisabled}
              startIcon={<VerifyIcon />}
            >
              Verify
            </AsyncButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default VerifierCard;
