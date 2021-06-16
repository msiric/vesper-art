import { withStyles } from "@material-ui/core/styles";
import { LocalizationProvider as MaterialLocalizationProvider } from "@material-ui/pickers";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledLocalizationProvider = withStyles({})(MaterialLocalizationProvider);

const LocalizationProvider = forwardRef(
  ({ loading = false, children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant="rect" loading={loading}>
        <StyledLocalizationProvider ref={ref} {...props}>
          {children}
        </StyledLocalizationProvider>
      </SkeletonWrapper>
    );
  }
);

export default LocalizationProvider;
