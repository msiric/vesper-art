import { List as MaterialList } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledList = withStyles({})(MaterialList);

const List = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="rect" loading={loading}>
      <StyledList ref={ref} {...props}>
        {children}
      </StyledList>
    </SkeletonWrapper>
  );
});

export default List;
