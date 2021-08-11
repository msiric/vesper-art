import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { featureFlags, upload } from "../../../../common/constants";
import { useUserStore } from "../../contexts/global/user";
import ImageInput from "../../controls/ImageInput/index";
import PriceInput from "../../controls/PriceInput/index";
import SelectInput from "../../controls/SelectInput/index";
import TextInput from "../../controls/TextInput/index";
import Link from "../../domain/Link";
import Paper from "../../domain/Paper";
import Popper from "../../domain/Popper";
import Typography from "../../domain/Typography";

const ArtworkForm = ({
  capabilities,
  preview,
  errors,
  setValue,
  trigger,
  getValues,
  watchables,
  editable,
  loading,
}) => {
  const [state, setState] = useState({ popper: { open: false, anchor: null } });
  const stripeId = useUserStore((state) => state.stripeId);

  const { artworkAvailability, artworkType, artworkLicense, artworkUse } =
    watchables;

  // FEATURE FLAG - stripe
  const isDisabled =
    !featureFlags.stripe ||
    !stripeId ||
    (stripeId &&
      !(
        capabilities.cardPayments === "active" &&
        capabilities.platformPayments === "active"
      ));

  const handleClick = (event) => {
    event.preventDefault();
    setState((prevState) => ({
      ...prevState,
      popper: {
        ...prevState.popper,
        open: !prevState.popper.open,
        anchor: prevState.popper.anchor ? null : event.currentTarget,
      },
    }));
  };

  return (
    <Box>
      <ImageInput
        name="artworkMedia"
        title="Artwork media"
        setValue={setValue}
        trigger={trigger}
        errors={errors}
        preview={preview}
        shape="square"
        variant="square"
        height={400}
        width="100%"
        noEmpty={false}
        editable={editable}
        isDynamic={true}
        loading={loading}
      />
      <Box>
        <Link component="button" variant="body2" onClick={handleClick}>
          What kind of file to upload?
        </Link>
        <Popper
          open={state.popper.open}
          anchorEl={state.popper.anchor}
          transition
        >
          <Paper>
            <Typography>{`Make sure the size of your artwork doesn't exceed ${
              upload.artwork.fileSize / 1024 / 1024
            } MB.`}</Typography>
            <Typography>{`Minimum file dimensions are: ${upload.artwork.fileDimensions.height}x${upload.artwork.fileDimensions.width}.`}</Typography>
            <Typography>{`Allowed file types are: ${upload.artwork.mimeTypes.map(
              (item, index) =>
                index === upload.artwork.mimeTypes.length - 1
                  ? `${item}.`
                  : ` ${item}`
            )}`}</Typography>
          </Paper>
        </Popper>
      </Box>
      <Box>
        <TextInput
          name="artworkTitle"
          type="text"
          label="Artwork title"
          errors={errors}
          loading={loading}
        />
        <SelectInput
          name="artworkAvailability"
          label="Artwork availability"
          errors={errors}
          options={[
            { value: "" },
            {
              value: "available",
              text: "Available for download",
            },
            { value: "unavailable", text: "Only for preview" },
          ]}
          loading={loading}
        />
        {artworkAvailability === "available" && (
          <SelectInput
            name="artworkType"
            label="Artwork type"
            errors={errors}
            options={[
              { value: "" },
              {
                value: "commercial",
                text: "Commercial",
                disabled: isDisabled,
              },
              { value: "free", text: "Free" },
            ]}
            loading={loading}
          />
        )}
        {artworkAvailability === "available" && (
          <SelectInput
            name="artworkLicense"
            label="Artwork license"
            errors={errors}
            options={[
              { value: "" },
              { value: "commercial", text: "Commercial" },
              { value: "personal", text: "Personal" },
            ]}
            loading={loading}
          />
        )}
        {artworkAvailability === "available" && artworkType === "commercial" && (
          <PriceInput
            name="artworkPersonal"
            value={getValues("artworkPersonal")}
            setValue={setValue}
            trigger={trigger}
            label="Personal license price"
            errors={errors}
            loading={loading}
          />
          /*             <TextInput
              name="artworkPersonal"
              type="text"
              label="Personal license price"
              adornment="$"
              errors={errors}
              loading={loading}
            /> */
        )}
        {artworkAvailability === "available" &&
          artworkLicense === "commercial" && (
            <SelectInput
              name="artworkUse"
              label="Artwork use"
              errors={errors}
              options={[
                { value: "" },
                {
                  value: "separate",
                  text: "Charge commercial license separately",
                  disabled: isDisabled,
                },
                artworkAvailability === "available" &&
                artworkType === "commercial"
                  ? {
                      value: "included",
                      text: "Include commercial license in the price",
                    }
                  : {
                      value: "included",
                      text: "Offer commercial license free of charge",
                    },
              ]}
              loading={loading}
            />
          )}
        {artworkAvailability === "available" &&
          artworkLicense === "commercial" &&
          artworkUse === "separate" && (
            <PriceInput
              name="artworkCommercial"
              value={getValues("artworkCommercial")}
              setValue={setValue}
              trigger={trigger}
              label="Commercial license price"
              errors={errors}
              loading={loading}
            />
            /*             <TextInput
              name="artworkCommercial"
              type="text"
              label="Commercial license price"
              adornment="$"
              errors={errors}
              loading={loading}
            /> */
          )}
        <SelectInput
          name="artworkVisibility"
          label="Artwork visibility"
          errors={errors}
          options={[
            { value: "" },
            {
              value: "visible",
              text: "Visible to everyone",
            },
            { value: "invisible", text: "Hidden to public" },
          ]}
          loading={loading}
        />
        <TextInput
          name="artworkDescription"
          type="text"
          label="Artwork description"
          errors={errors}
          multiline
          loading={loading}
        />
        {/* <TagInput
          name="artworkTags"
          trigger={trigger}
          value={getValues("artworkTags")}
          label="Artwork tags"
          errors={errors}
          handleChange={(e, item) => setValue("artworkTags", item || [])}
          limit={5}
          multiline
        /> */}
      </Box>
    </Box>
  );
};

export default ArtworkForm;
