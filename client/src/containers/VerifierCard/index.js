import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import VerifierForm from "../../forms/VerifierForm/index.js";
import verifierCardStyles from "./styles.js";

const fingerprintValidation = Yup.object().shape({
  licenseFingerprint: Yup.string()
    .trim()
    .required("Fingerprint cannot be empty"),
});

const VerifierCard = () => {
  const loading = useLicenseVerifier((state) => state.license.loading);
  const fetchLicense = useLicenseVerifier((state) => state.fetchLicense);

  const classes = verifierCardStyles();

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
    defaultValues: {
      licenseFingerprint: "",
    },
    resolver: yupResolver(fingerprintValidation),
  });

  return (
    <Card>
      <FormProvider control={control}>
        <form
          onSubmit={handleSubmit(() =>
            fetchLicense({ licenseData: getValues() })
          )}
        >
          <CardContent>
            <VerifierForm errors={errors} loading={loading} />
          </CardContent>
          <CardActions className={classes.verifierActions}>
            <AsyncButton
              type="submit"
              fullWidth
              padding
              submitting={formState.isSubmitting}
              startIcon={<UploadIcon />}
            >
              Verify
            </AsyncButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default withSnackbar(VerifierCard);
