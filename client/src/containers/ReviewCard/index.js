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
import queryString from "query-string";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import SubHeading from "../../components/SubHeading/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import { Typography } from "../../styles/theme.js";
import reviewCardStyles from "./styles.js";

const ReviewCard = ({ paramId, highlightRef }) => {
  const userId = useUserStore((state) => state.id);

  const review = useOrderDetails((state) => state.order.data.review);
  const buyer = useOrderDetails((state) => state.order.data.buyer);
  const loading = useOrderDetails((state) => state.order.loading);
  const fetchOrder = useOrderDetails((state) => state.fetchOrder);
  const toggleModal = useOrderDetails((state) => state.toggleModal);

  const location = useLocation();
  const query = queryString.parse(location.search);
  const shouldReview = () => userId === buyer.id;
  const isHighlight = () => query && query.notif === "review";

  const history = useHistory();
  const classes = reviewCardStyles();

  useEffect(() => {
    fetchOrder({ orderId: paramId, query, highlightRef });
  }, []);

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
                {shouldReview() ? "No rating left" : "No rating found"}
              </Typography>
            </SkeletonWrapper>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions>
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
                  {shouldReview() ? "Your rating" : "Buyer's rating"}
                </Typography>
              </SkeletonWrapper>
            ) : shouldReview() ? (
              <Button
                variant="outlined"
                startIcon={<ReviewIcon />}
                onClick={toggleModal}
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
