import { Box, Button, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Rating } from "@material-ui/lab";
import React from "react";
import { useHistory } from "react-router-dom";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import { Typography } from "../../styles/theme.js";

const useStyles = makeStyles((muiTheme) => ({
  reviewContainer: {
    display: "flex",
    flexDirection: "column",
  },
  reviewContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const ReviewCard = ({ review, handleModalOpen, shouldReview, loading }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Card className={classes.reviewContainer}>
      <Box>
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography m={2}>Review</Typography>
        </SkeletonWrapper>
      </Box>
      {review ? (
        shouldReview ? (
          <Box className={classes.reviewContent}>
            <SkeletonWrapper variant="text" loading={loading} width="100%">
              <Typography m={2} fontSize="h6.fontSize">
                Your rating
              </Typography>
            </SkeletonWrapper>
            <Rating value={review.rating} readOnly />
          </Box>
        ) : (
          <Box className={classes.reviewContent}>
            <SkeletonWrapper variant="text" loading={loading} width="100%">
              <Typography m={2} fontSize="h6.fontSize">
                Buyer's rating
              </Typography>
            </SkeletonWrapper>
            <Rating value={review.rating} readOnly />
          </Box>
        )
      ) : shouldReview ? (
        <Box className={classes.reviewContent}>
          <SkeletonWrapper variant="text" loading={loading} width="100%">
            <Typography m={2} fontSize="h6.fontSize">
              No rating left
            </Typography>
          </SkeletonWrapper>
          <Button onClick={handleModalOpen}>Rate artist</Button>
        </Box>
      ) : (
        <Box className={classes.reviewContent}>
          <SkeletonWrapper variant="text" loading={loading} width="100%">
            <Typography m={2} fontSize="h6.fontSize">
              No rating found
            </Typography>
          </SkeletonWrapper>
        </Box>
      )}
    </Card>
  );
};

export default ReviewCard;
