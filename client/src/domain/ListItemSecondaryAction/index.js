import { ListItemSecondaryAction as MaterialListItemSecondaryAction } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledListItemSecondaryAction = withStyles({})(
  MaterialListItemSecondaryAction
);

const ListItemSecondaryAction = forwardRef(
  ({ loading = false, children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant="rect" loading={loading}>
        <StyledListItemSecondaryAction ref={ref} {...props}>
          {children}
        </StyledListItemSecondaryAction>
      </SkeletonWrapper>
    );
  }
);

export default ListItemSecondaryAction;
