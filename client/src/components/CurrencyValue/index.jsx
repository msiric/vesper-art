import React from "react";
import NumberFormat from "react-number-format";
import SkeletonWrapper from "../SkeletonWrapper/index";

const CurrencyValue = ({
  loading = false,
  value = 0,
  displayType = "text",
  thousandSeparator = true,
  decimalScale = 2,
  prefix = "$",
  onValueChange,
  ...props
}) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <NumberFormat
        {...props}
        value={value}
        displayType={displayType}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        prefix={prefix}
        onChange={() => null}
        onValueChange={onValueChange}
      />
    </SkeletonWrapper>
  );
};

export default CurrencyValue;
