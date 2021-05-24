import { yupResolver } from "@hookform/resolvers/yup";
import { Card, CardActions, CardContent } from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";
import VerifierForm from "../../forms/VerifierForm/index.js";

const fingerprintValidation = Yup.object().shape({
  licenseFingerprint: Yup.string()
    .trim()
    .required("Fingerprint cannot be empty"),
});

const VerifierCard = () => {
  const loading = useLicenseVerifier((state) => state.license.loading);
  const fetchLicense = useLicenseVerifier((state) => state.fetchLicense);

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
          <CardActions
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <AsyncButton
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              padding
              submitting={formState.isSubmitting}
              loading={loading}
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
