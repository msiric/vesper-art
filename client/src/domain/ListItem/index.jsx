import { ListItem as MaterialListItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledListItem = withStyles({})(MaterialListItem);

const ListItem = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="rect" loading={loading}>
      <StyledListItem ref={ref} {...props}>
        {children}
      </StyledListItem>
    </SkeletonWrapper>
  );
});

export default ListItem;
