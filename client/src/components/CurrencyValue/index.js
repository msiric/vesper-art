import React from "react";
import NumberFormat from "react-number-format";
import SkeletonWrapper from "../SkeletonWrapper/index";
import currencyValueStyles from "./styles";

const CurrencyValue = ({
  loading = false,
  value = 0,
  displayType = "text",
  thousandSeparator = true,
  decimalScale = 2,
  prefix = "$",
  ...props
}) => {
  const classes = currencyValueStyles();

  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <NumberFormat
        value={value}
        displayType={displayType}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        prefix={prefix}
        {...props}
      />
    </SkeletonWrapper>
  );
};

export default CurrencyValue;
