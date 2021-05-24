import { Avatar as MaterialAvatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledAvatar = withStyles({})(MaterialAvatar);

const Avatar = ({ loading = false, ...props }) => {
  return (
    <SkeletonWrapper variant="circle" loading={loading}>
      <StyledAvatar {...props} />
    </SkeletonWrapper>
  );
};

export default Avatar;
