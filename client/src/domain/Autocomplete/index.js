import { withStyles } from "@material-ui/core/styles";
import { Autocomplete as MaterialAutocomplete } from "@material-ui/lab";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledAutocomplete = withStyles({})(MaterialAutocomplete);

const Autocomplete = forwardRef(
  ({ loading = false, variant = "text", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledAutocomplete ref={ref} {...props}>
          {children}
        </StyledAutocomplete>
      </SkeletonWrapper>
    );
  }
);

export default Autocomplete;
