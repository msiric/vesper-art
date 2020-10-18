import { Box, Button, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { StarsRounded as ReviewIcon } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import React from "react";
import { useHistory } from "react-router-dom";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import { artepunktTheme, Typography } from "../../styles/theme.js";

const useStyles = makeStyles((muiTheme) => ({
  reviewContainer: {
    display: "flex",
    flexDirection: "column",
  },
  highlightContainer: {
    border: "2px transparent solid",
    borderRadius: "4px",
    animation: "$blink 0.8s",
    animationIterationCount: 3,
    backgroundColor: "#525252",
  },
  "@keyframes blink": {
    "50%": {
      borderColor: artepunktTheme.palette.primary.main,
    },
  },
  reviewContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const ReviewCard = ({
  review,
  handleModalOpen,
  shouldReview,
  queryNotif,
  highlightRef,
  loading,
}) => {
  const history = useHistory();
  const classes = useStyles();

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
