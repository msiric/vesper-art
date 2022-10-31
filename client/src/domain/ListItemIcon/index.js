import { ListItemIcon as MaterialListItemIcon } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledListItemIcon = withStyles({})(MaterialListItemIcon);

const ListItemIcon = forwardRef(
  ({ loading = false, children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant="rect" loading={loading}>
        <StyledListItemIcon ref={ref} {...props}>
          {children}
        </StyledListItemIcon>
      </SkeletonWrapper>
    );
  }
);

export default ListItemIcon;
