import { ListItemText as MaterialListItemText } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledListItemText = withStyles({})(MaterialListItemText);

const ListItemText = forwardRef(({ loading = false, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledListItemText ref={ref} {...props} />
    </SkeletonWrapper>
  );
});

export default ListItemText;
