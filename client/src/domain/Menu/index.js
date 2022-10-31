import { Menu as MaterialMenu } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledMenu = withStyles({})(MaterialMenu);

const Menu = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="rect" loading={loading}>
      <StyledMenu ref={ref} {...props}>
        {children}
      </StyledMenu>
    </SkeletonWrapper>
  );
});

export default Menu;
