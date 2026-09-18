import { ListItemAvatar as MaterialListItemAvatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledListItemAvatar = withStyles({})(MaterialListItemAvatar);

const ListItemAvatar = forwardRef(
  ({ loading = false, children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant="rect" loading={loading}>
        <StyledListItemAvatar ref={ref} {...props}>
          {children}
        </StyledListItemAvatar>
      </SkeletonWrapper>
    );
  }
);

export default ListItemAvatar;
