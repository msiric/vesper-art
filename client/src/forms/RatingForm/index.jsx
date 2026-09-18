import { Box } from "@material-ui/core";
import React from "react";
import RatingInput from "../../controls/RatingInput/index";

const RatingForm = ({ setValue, getValues, errors, loading }) => {
  return (
    <Box>
      <RatingInput
        value={getValues("reviewRating")}
        setValue={setValue}
        name="reviewRating"
        type="text"
        label=""
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default RatingForm;
