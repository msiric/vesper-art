import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput";

const DiscountForm = ({ errors, loading }) => {
  return (
    <Box>
      <TextInput
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
