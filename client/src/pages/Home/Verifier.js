import { yupResolver } from "@hookform/resolvers/yup";
import {
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import { format } from "date-fns";
import { withSnackbar } from "notistack";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import AsyncButton from "../../components/AsyncButton/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import VerifierForm from "../../forms/VerifierForm/index.js";
import { postVerifier } from "../../services/home.js";
import globalStyles from "../../styles/global.js";

const fingerprintValidation = Yup.object().shape({
  licenseFingerprint: Yup.string()
    .trim()
    .required("Fingerprint cannot be empty"),
});

const Verifier = () => {
  const [state, setState] = useState({
    loading: false,
    license: {},
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
    defaultValues: {
      licenseFingerprint: "",
    },
    resolver: yupResolver(fingerprintValidation),
  });

  const formatDate = (date, type) => {
    return format(new Date(date), type);
  };

  const globalClasses = globalStyles();

  const onSubmit = async (values) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const { data } = await postVerifier.request({ data: values });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        license: data.license,
      }));
      reset();
    } catch (err) {
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container>
        <Grid item xs={12}>
          <FormProvider control={control}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                <VerifierForm errors={errors} loading={state.loading} />
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
                  loading={formState.isSubmitting}
                  startIcon={<UploadIcon />}
                >
                  Verify
                </AsyncButton>
              </CardActions>
            </form>
          </FormProvider>
          {state.loading ? (
            <LoadingSpinner />
          ) : state.license.id ? (
            <div className="table-responsive">
              <table className="simple">
                <thead>
                  <tr>
                    <th>Fingerprint</th>
                    <th>Type</th>
                    <th>Buyer</th>
                    <th>Seller</th>
                    <th>Price</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={state.license.id}>
                    <td>
                      <Typography className="truncate">
                        {state.license.fingerprint}
                      </Typography>
                    </td>
                    <td className="w-64 text-right">
                      <span className="truncate">{state.license.type}</span>
                    </td>
                    <td className="w-64 text-right">
                      <span className="truncate">
                        {state.license.owner.name}
                      </span>
                    </td>
                    <td className="w-64 text-right">
                      <span className="truncate">
                        {state.license.artwork.owner.name}
                      </span>
                    </td>
                    <td className="w-64 text-right">
                      <span className="truncate">${state.license.price}</span>
                    </td>
                    <td className="w-64 text-right">
                      <span className="truncate">
                        {formatDate(state.license.created, "dd/MM/yyyy")}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            "Enter a license fingerprint"
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default withSnackbar(Verifier);
