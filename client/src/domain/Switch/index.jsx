import { Switch as MaterialSwitch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledSwitch = withStyles({})(MaterialSwitch);

const Switch = forwardRef(({ loading = false, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledSwitch ref={ref} {...props} />
    </SkeletonWrapper>
  );
});

export default Switch;
