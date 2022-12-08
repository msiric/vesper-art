import { yupResolver } from "@hookform/resolvers/yup";
import { AssignmentTurnedInOutlined as VerifyIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { fingerprintValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import VerifierForm from "../../forms/VerifierForm/index";
import { isFormDisabled } from "../../utils/helpers";
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

  const { handleSubmit, formState, errors, control, getValues, watch, reset } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(fingerprintValidation),
    });

  watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  useEffect(() => {
    reset(setDefaultValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [license]);

  return (
    <Card>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(fetchLicense)}>
          <CardContent>
            <VerifierForm errors={errors} loading={loading} />
          </CardContent>
          <CardActions className={classes.actions}>
            <AsyncButton
              type="submit"
              color="secondary"
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
