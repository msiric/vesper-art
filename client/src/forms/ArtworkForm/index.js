import { Box } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { useUserStore } from "../../contexts/global/user.js";
import ImageInput from "../../controls/ImageInput/index.js";
import PriceInput from "../../controls/PriceInput/index.js";
import SelectInput from "../../controls/SelectInput/index.js";
import TextInput from "../../controls/TextInput/index.js";

/* import AddArtworkStyles from "../../components/Artwork/AddArtwork.style.js"; */

const ArtworkForm = ({
  capabilities,
  preview,
  errors,
  setValue,
  trigger,
  getValues,
  watch,
  watchables,
  editable,
  loading,
}) => {
  const stripeId = useUserStore((state) => state.stripeId);

  const {
    artworkAvailability,
    artworkType,
    artworkLicense,
    artworkUse,
  } = watchables.length ? watch(watchables) : watch();

  const history = useHistory();

  /* const classes = AddArtworkStyles(); */
  const classes = {};

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
        height={400}
        width="100%"
        noEmpty={false}
        editable={editable}
        loading={loading}
      />
      <Box>
        <TextInput
          name="artworkTitle"
          type="text"
          label="Artwork title"
          errors={errors}
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
                disabled:
                  stripeId &&
                  capabilities.cardPayments === "active" &&
                  capabilities.platformPayments === "active"
                    ? false
                    : true,
              },
              { value: "free", text: "Free" },
            ]}
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
          />
        )}
        {artworkAvailability === "available" &&
          artworkType === "commercial" && (
            <PriceInput
              name="artworkPersonal"
              value={getValues("artworkPersonal")}
              setValue={setValue}
              trigger={trigger}
              label="Personal license price"
              errors={errors}
            />
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
                  disabled:
                    stripeId &&
                    capabilities.cardPayments === "active" &&
                    capabilities.platformPayments === "active"
                      ? false
                      : true,
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
            />
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
        />
        <TextInput
          name="artworkDescription"
          type="text"
          label="Artwork description"
          errors={errors}
          multiline
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
