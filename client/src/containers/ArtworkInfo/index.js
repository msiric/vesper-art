import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card } from "@material-ui/core";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { licenseValidation } from "../../../../common/validation";
import PricingCard from "../../components/PricingCard/index.js";
import PromptModal from "../../components/PromptModal/index.js";
import SwipeCard from "../../components/SwipeCard/index.js";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import { useArtworkStore } from "../../contexts/local/Artwork";
import LicenseForm from "../../forms/LicenseForm/index.js";
import { CardContent, Typography } from "../../styles/theme.js";
import artworkInfoStyles from "./styles.js";

const ArtworkInfo = () => {
  const artwork = useArtworkStore((state) => state.artwork.data);
  const loading = useArtworkStore((state) => state.artwork.loading);
  const license = useArtworkStore((state) => state.license);
  const tabs = useArtworkStore((state) => state.tabs);
  const modal = useArtworkStore((state) => state.modal);
  const downloadArtwork = useArtworkStore((state) => state.downloadArtwork);
  const purchaseArtwork = useArtworkStore((state) => state.purchaseArtwork);
  const openModal = useArtworkStore((state) => state.openModal);
  const closeModal = useArtworkStore((state) => state.closeModal);
  const changeTab = useArtworkStore((state) => state.changeTab);

  const history = useHistory();
  const [userStore] = useUserContext();
  const classes = artworkInfoStyles();

  const setDefaultValues = () => ({
    licenseType: license,
    licenseAssignee: "",
    licenseCompany: "",
  });

  const {
    getValues,
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    watch,
    reset,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(licenseValidation),
  });

  const isSeller = () => userStore.id === artwork.owner.id;

  useEffect(() => {
    reset(setDefaultValues());
  }, [license]);

  return (
    <Card className={classes.root} loading={loading}>
      <CardContent pt={0} pb={0}>
        {artwork.current && artwork.current.availability === "available" ? (
          <SwipeCard
            tabs={{
              value: tabs.value,
              headings: [
                {
                  display: artwork.current.use !== "included",
                  label: "Personal license",
                  props: {},
                },
                {
                  display: artwork.current.license === "commercial",
                  label: "Commercial license",
                  props: {},
                },
              ],
              items: [
                {
                  display: artwork.current.use !== "included",
                  iterable: false,
                  content: null,
                  component: (
                    <PricingCard
                      artworkId={artwork.id}
                      versionId={artwork.current.id}
                      price={artwork.current.personal}
                      isSeller={isSeller}
                      heading="Personal license. Use for personal projects, social media, and
                  non commercial activities"
                      list={[]}
                      license="personal"
                      handlePurchase={({ versionId, license }) =>
                        purchaseArtwork({ history, versionId, license })
                      }
                      handleModalOpen={openModal}
                    />
                  ),
                  error: null,
                  loading: loading,
                },
                {
                  display: artwork.current.license === "commercial",
                  iterable: false,
                  content: null,
                  component: (
                    <PricingCard
                      artworkId={artwork.id}
                      versionId={artwork.current.id}
                      price={artwork.current.commercial}
                      isSeller={isSeller}
                      heading="Commercial license. Use anywhere in the world for unlimited projects with no expiration dates"
                      list={[]}
                      license="commercial"
                      handlePurchase={({ versionId, license }) =>
                        purchaseArtwork({ history, versionId, license })
                      }
                      handleModalOpen={openModal}
                    />
                  ),
                  error: null,
                  loading: loading,
                },
              ],
            }}
            handleTabsChange={(e, index) => changeTab({ index })}
            handleChangeIndex={(e, index) => changeTab({ index })}
            margin="0px -16px"
            loading={loading}
          />
        ) : (
          <SwipeCard
            tabs={{
              value: tabs.value,
              headings: [
                {
                  display: true,
                  label: "Preview only",
                  props: {},
                },
              ],
              items: [
                {
                  display: true,
                  iterable: false,
                  content: null,
                  component: (
                    <Box
                      display="flex"
                      flexDirection="column"
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Typography variant="subtitle1" m={2}>
                        This artwork cannot be purchased or downloaded since it
                        is preview only
                      </Typography>
                      {!loading && isSeller() && (
                        <Button
                          variant="outlined"
                          color="primary"
                          component={RouterLink}
                          to={`/artwork/${artwork.id}/edit`}
                        >
                          Edit artwork
                        </Button>
                      )}
                    </Box>
                  ),
                  error: null,
                  loading: loading,
                },
              ],
            }}
            handleTabsChange={(e, index) => changeTab({ index })}
            handleChangeIndex={(e, index) => changeTab({ index })}
            margin="0px -16px"
            loading={loading}
          />
        )}
      </CardContent>
      <PromptModal
        open={modal.open}
        handleConfirm={handleSubmit(() =>
          downloadArtwork({
            versionId: artwork.current.id,
            values: getValues(),
          })
        )}
        handleClose={closeModal}
        ariaLabel="License information"
        promptTitle="License information"
        promptConfirm="Download"
        promptCancel="Close"
        isSubmitting={formState.isSubmitting}
      >
        <FormProvider control={control}>
          <form
            onSubmit={handleSubmit(() =>
              downloadArtwork({
                versionId: artwork.current.id,
                values: getValues(),
              })
            )}
          >
            <LicenseForm
              version={artwork.current}
              errors={errors}
              loading={loading}
            />
          </form>
        </FormProvider>
      </PromptModal>
    </Card>
  );
};

export default ArtworkInfo;
