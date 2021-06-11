import { Link as MaterialLink } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledLink = withStyles({})(MaterialLink);

const Link = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledLink ref={ref} {...props}>
        {children}
      </StyledLink>
    </SkeletonWrapper>
  );
});

export default Link;
