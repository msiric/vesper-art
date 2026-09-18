import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput";

const DiscountForm = ({ getValues, errors, loading }) => {
  return (
    <Box>
      <TextInput
        value={getValues("discountCode")}
        name="discountCode"
        type="text"
        label="Discount code"
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default DiscountForm;
