import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
} from "@material-ui/core";
import { StarsRounded as ReviewIcon } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import React from "react";
import { useHistory } from "react-router-dom";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import SubHeading from "../../components/SubHeading/index.js";
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
      <CardContent
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <SubHeading text="Review" loading={loading} />
        {loading || review ? (
          <Box className={classes.reviewContent}>
            <SkeletonWrapper loading={loading}>
              <Rating value={review.rating} readOnly />
            </SkeletonWrapper>
          </Box>
        ) : (
          <Box className={classes.reviewContent}>
            <SkeletonWrapper variant="text" loading={loading}>
              <Typography m={2}>
                {shouldReview ? "No rating left" : "No rating found"}
              </Typography>
            </SkeletonWrapper>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions style={{ padding: "16px 0" }}>
        <SkeletonWrapper loading={loading} width="100%">
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {loading || review ? (
              <SkeletonWrapper variant="text" loading={loading}>
                <Typography m={2}>
                  {shouldReview ? "Your rating" : "Buyer's rating"}
                </Typography>
              </SkeletonWrapper>
            ) : shouldReview ? (
              <Button
                variant="outlined"
                startIcon={<ReviewIcon />}
                onClick={handleModalOpen}
              >
                Rate artist
              </Button>
            ) : (
              <Typography m={2}>Buyer's rating</Typography>
            )}
          </Box>
        </SkeletonWrapper>
      </CardActions>
    </Card>
  );
};

export default ReviewCard;
