import { Box } from "@material-ui/core";
import React from "react";
import { featureFlags, upload } from "../../../../common/constants";
import { formatBytes } from "../../../../common/helpers";
import UploadPopover from "../../components/UploadPopover";
import { useUserStore } from "../../contexts/global/user";
import ImageInput from "../../controls/ImageInput/index";
import PriceInput from "../../controls/PriceInput/index";
import SelectInput from "../../controls/SelectInput/index";
import TextInput from "../../controls/TextInput/index";

const ArtworkForm = ({
  preview,
  errors,
  setValue,
  trigger,
  getValues,
  watchables,
  editable,
  loading,
}) => {
  const onboarded = useUserStore((state) => state.onboarded);

  const { artworkAvailability, artworkType, artworkLicense, artworkUse } =
    watchables;

  // FEATURE FLAG - stripe
  const isDisabled = !featureFlags.stripe || !onboarded;

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
        isDynamic
        loading={loading}
      />
      {editable && (
        <UploadPopover
          label="What kind of file to upload?"
          size={formatBytes(upload.artwork.fileSize)}
          type="artwork"
          dimensions={{
            height: upload.artwork.fileDimensions.height,
            width: upload.artwork.fileDimensions.width,
          }}
          aspectRatio={upload.artwork.fileRatio}
          types={upload.artwork.mimeTypes}
          loading={loading}
        />
      )}
      <Box>
        <TextInput
          value={getValues("artworkTitle")}
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
          showMaxChars
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
