import { Link as MaterialLink } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledLink = withStyles({})(MaterialLink);

const Link = ({ loading = false, children, ...props }) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledLink {...props}>{children}</StyledLink>
    </SkeletonWrapper>
  );
};

export default Link;
