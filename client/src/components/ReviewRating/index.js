import { Rating } from "@material-ui/lab";
import React from "react";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import reviewRatingStyles from "./styles.js";

const ReviewRating = ({ loading, value, readOnly }) => {
  const classes = reviewRatingStyles();

  return (
    <SkeletonWrapper loading={loading}>
      <Rating value={value} readOnly={readOnly} />
    </SkeletonWrapper>
  );
};

export default ReviewRating;
