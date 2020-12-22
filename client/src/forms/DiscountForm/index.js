import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput";

const DiscountForm = ({ errors }) => {
  return (
    <Box>
      <TextInput
        name="discountCode"
        type="text"
        label="Discount code"
        errors={errors}
      />
    </Box>
  );
};

export default DiscountForm;
