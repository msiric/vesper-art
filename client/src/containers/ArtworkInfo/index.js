import { GetAppOutlined as DownloadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { isFormAltered, isLicenseValid } from "../../../../common/helpers";
import { licenseValidation } from "../../../../common/validation";
import LicenseAlert from "../../components/LicenseAlert";
import PricingCard from "../../components/PricingCard/index";
import PromptModal from "../../components/PromptModal/index";
import SwipeCard from "../../components/SwipeCard/index";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import LicenseForm from "../../forms/LicenseForm/index";
import { useLicenseValidator } from "../../hooks/useLicenseValidator";
import artworkInfoStyles from "./styles";

const ArtworkInfo = () => {
  const artwork = useArtworkDetails((state) => state.artwork.data);
  const artworkLoading = useArtworkDetails((state) => state.artwork.loading);
  const orders = useArtworkDetails((state) => state.orders.data);
  const ordersLoading = useArtworkDetails((state) => state.orders.loading);
  const license = useArtworkDetails((state) => state.license);
  const tabs = useArtworkDetails((state) => state.tabs);
  const modal = useArtworkDetails((state) => state.modal);
  const fetchOrders = useArtworkDetails((state) => state.fetchOrders);
  const downloadArtwork = useArtworkDetails((state) => state.downloadArtwork);
  const purchaseArtwork = useArtworkDetails((state) => state.purchaseArtwork);
  const openModal = useArtworkDetails((state) => state.openModal);
  const closeModal = useArtworkDetails((state) => state.closeModal);
  const changeTab = useArtworkDetails((state) => state.changeTab);

  const userId = useUserStore((state) => state.id);
  const userName = useUserStore((state) => state.fullName);

  const resolver = useLicenseValidator(licenseValidation);

  const history = useHistory();
  const classes = artworkInfoStyles();

  const setDefaultValues = () => ({
    licenseUsage: "",
    licenseCompany: "",
    licenseType: license,
  });

  const { getValues, handleSubmit, formState, errors, control, watch, reset } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver,
    });

  const watchedValues = watch();

  const isSeller = userId === artwork.owner.id;

  const licenseStatus = isLicenseValid({
    data: getValues(),
    orders,
  });

  const isDisabled =
    !isFormAltered(getValues(), setDefaultValues()) ||
    formState.isSubmitting ||
    !licenseStatus.valid;

  useEffect(() => {
    reset(setDefaultValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [license]);

  return (
    <Card>
      <CardContent className={classes.content}>
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
                  component: (
                    <PricingCard
                      artworkId={artwork.id}
                      versionId={artwork.current.id}
                      price={artwork.current.personal}
                      isSeller={isSeller}
                      isAvailable
                      heading="Personal license. Use for personal projects, websites, social media and other non-commercial activities."
                      license="personal"
                      loading={artworkLoading}
                      handlePurchase={({ versionId, license }) =>
                        purchaseArtwork({ history, versionId, license })
                      }
                      handleModalOpen={
                        orders.length
                          ? openModal
                          : () => fetchOrders({ userId, artworkId: artwork.id })
                      }
                      submitting={ordersLoading}
                    />
                  ),
                  error: null,
                },
                {
                  display: artwork.current.license === "commercial",
                  component: (
                    <PricingCard
                      artworkId={artwork.id}
                      versionId={artwork.current.id}
                      price={artwork.current.commercial}
                      isSeller={isSeller}
                      isAvailable
                      heading="Commercial license. Use for advertising, promotion, product integration and other commercial activities."
                      license="commercial"
                      loading={artworkLoading}
                      handlePurchase={({ versionId, license }) =>
                        purchaseArtwork({ history, versionId, license })
                      }
                      handleModalOpen={
                        orders.length
                          ? openModal
                          : () => fetchOrders({ userId, artworkId: artwork.id })
                      }
                      submitting={ordersLoading}
                    />
                  ),
                  error: null,
                },
              ],
            }}
            handleTabsChange={({ index }) => changeTab({ index })}
            handleChangeIndex={({ index }) => changeTab({ index })}
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
                  component: (
                    <PricingCard
                      artworkId={artwork.id}
                      versionId={artwork.current.id}
                      price={0}
                      isSeller={isSeller}
                      isAvailable={false}
                      heading="This artwork cannot be purchased or downloaded since it is preview only"
                      list={[]}
                      license=""
                      loading={artworkLoading}
                      noPriceFormat="Preview"
                      submitting={ordersLoading}
                    />
                  ),
                  error: null,
                },
              ],
            }}
            handleTabsChange={({ index }) => changeTab({ index })}
            handleChangeIndex={({ index }) => changeTab({ index })}
          />
        )}
      </CardContent>
      <PromptModal
        open={modal.open}
        handleConfirm={handleSubmit(() =>
          downloadArtwork({
            versionId: artwork.current.id,
            values: getValues(),
            history,
          })
        )}
        handleClose={closeModal}
        ariaLabel="License information"
        promptTitle="License information"
        promptConfirm="Download"
        promptCancel="Close"
        isDisabled={isDisabled}
        isSubmitting={formState.isSubmitting}
        startIcon={<DownloadIcon />}
      >
        {!!orders.length && <LicenseAlert licenseStatus={licenseStatus} />}
        <FormProvider control={control}>
          <form
            onSubmit={handleSubmit(
              async () =>
                await downloadArtwork({
                  versionId: artwork.current.id,
                  values: getValues(),
                })
            )}
          >
            <LicenseForm
              getValues={getValues}
              version={artwork.current}
              userName={userName}
              isFree
              watchables={{
                licenseUsage: watchedValues.licenseUsage,
              }}
              errors={errors}
              loading={artworkLoading}
            />
          </form>
        </FormProvider>
      </PromptModal>
    </Card>
  );
};

export default ArtworkInfo;
