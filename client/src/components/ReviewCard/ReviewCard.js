import { Box, Button, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Rating } from "@material-ui/lab";
import React from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "../../constants/theme.js";

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

const ReviewCard = ({ review, handleModalOpen, shouldReview }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Card className={classes.reviewContainer}>
      <Box>
        <Typography m={2}>Review</Typography>
      </Box>
      {review ? (
        shouldReview ? (
          <Box className={classes.reviewContent}>
            <Typography m={2} fontSize="h6.fontSize">
              Your rating
            </Typography>
            <Rating value={review.rating} readOnly />
          </Box>
        ) : (
          <Box className={classes.reviewContent}>
            <Typography m={2} fontSize="h6.fontSize">
              Buyer's rating
            </Typography>
            <Rating value={review.rating} readOnly />
          </Box>
        )
      ) : shouldReview ? (
        <Box className={classes.reviewContent}>
          <Typography m={2} fontSize="h6.fontSize">
            No rating left
          </Typography>
          <Button onClick={handleModalOpen}>Rate artist</Button>
        </Box>
      ) : (
        <Box className={classes.reviewContent}>
          <Typography m={2} fontSize="h6.fontSize">
            No rating found
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default ReviewCard;
