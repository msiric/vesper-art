import { Box, Button, Card } from "@material-ui/core";
import { StarsRounded as ReviewIcon } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import React from "react";
import { useHistory } from "react-router-dom";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { Typography } from "../../styles/theme.js";
import reviewCardStyles from "./styles.js";

const ReviewCard = ({
  review,
  handleModalOpen,
  shouldReview,
  queryNotif,
  highlightRef,
  loading,
}) => {
  const history = useHistory();
  const classes = reviewCardStyles();

  const isHighlight = () => queryNotif && queryNotif === "review";

  return (
    <Card
      ref={isHighlight() ? highlightRef : null}
      className={`${classes.reviewContainer} ${
        isHighlight() ? classes.highlightContainer : ""
      }`}
    >
      <Box>
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography m={2}>Review</Typography>
        </SkeletonWrapper>
      </Box>
      {loading || review ? (
        shouldReview ? (
          <Box className={classes.reviewContent}>
            <SkeletonWrapper variant="text" loading={loading}>
              <Typography m={2}>Your rating</Typography>
            </SkeletonWrapper>
            <SkeletonWrapper loading={loading}>
              <Rating value={review.rating} readOnly />
            </SkeletonWrapper>
          </Box>
        ) : (
          <Box className={classes.reviewContent}>
            <SkeletonWrapper variant="text" loading={loading}>
              <Typography m={2}>Buyer's rating</Typography>
            </SkeletonWrapper>
            <SkeletonWrapper loading={loading}>
              <Rating value={review.rating} readOnly />
            </SkeletonWrapper>
          </Box>
        )
      ) : shouldReview ? (
        <Box className={classes.reviewContent}>
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography m={2}>No rating left</Typography>
          </SkeletonWrapper>
          <Button startIcon={<ReviewIcon />} onClick={handleModalOpen}>
            Rate artist
          </Button>
        </Box>
      ) : (
        <Box className={classes.reviewContent}>
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography m={2}>No rating found</Typography>
          </SkeletonWrapper>
        </Box>
      )}
    </Card>
  );
};

export default ReviewCard;
