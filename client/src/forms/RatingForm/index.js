import { Box } from "@material-ui/core";
import React from "react";
import RatingInput from "../../controls/RatingInput/index.js";

const RatingForm = ({ setValue, getValues, errors }) => {
  return (
    <Box>
      <RatingInput
        value={getValues("artistRating")}
        setValue={setValue}
        name="artistRating"
        type="text"
        label=""
        errors={errors}
      />
    </Box>
  );
};

export default RatingForm;