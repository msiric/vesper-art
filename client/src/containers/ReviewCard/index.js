import { StarsRounded as ReviewIcon } from "@material-ui/icons";
import queryString from "query-string";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ReviewRating from "../../components/ReviewRating/index.js";
import SubHeading from "../../components/SubHeading/index.js";
import SyncButton from "../../components/SyncButton";
import { useUserStore } from "../../contexts/global/user.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import Typography from "../../domain/Typography";
import reviewCardStyles from "./styles.js";

const ReviewCard = ({ paramId, highlightRef }) => {
  const userId = useUserStore((state) => state.id);

  const artwork = useOrderDetails((state) => state.order.data.artwork);
  const review = useOrderDetails((state) => state.order.data.review);
  const buyer = useOrderDetails((state) => state.order.data.buyer);
  const loading = useOrderDetails((state) => state.order.loading);
  const fetchOrder = useOrderDetails((state) => state.fetchOrder);
  const toggleModal = useOrderDetails((state) => state.toggleModal);

  const location = useLocation();
  const query = queryString.parse(location.search);
  const shouldReview = userId === buyer.id;
  const isActive = artwork.active;
  const isHighlight = query && query.notif === "review";

  const history = useHistory();
  const classes = reviewCardStyles();

  useEffect(() => {
    fetchOrder({ orderId: paramId, query, highlightRef });
  }, []);

  return (
    <Card
      ref={isHighlight ? highlightRef : null}
      className={`${classes.reviewContainer} ${
        isHighlight ? classes.highlightContainer : ""
      }`}
    >
      <CardContent className={classes.reviewCard}>
        <SubHeading text="Review" loading={loading} />
        {loading || review ? (
          <Box className={classes.reviewWrapper}>
            <ReviewRating
              value={review.rating}
              readOnly={true}
              loading={loading}
            />
          </Box>
        ) : (
          <Box className={classes.reviewContent}>
            <Typography className={classes.reviewText} loading={loading}>
              {shouldReview ? "No rating left" : "No rating found"}
            </Typography>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Box className={classes.reviewActions}>
          {loading || review ? (
            <Typography className={classes.reviewText} loading={loading}>
              {shouldReview ? "Your rating" : "Buyer's rating"}
            </Typography>
          ) : isActive ? (
            shouldReview ? (
              <SyncButton
                variant="outlined"
                startIcon={<ReviewIcon />}
                onClick={toggleModal}
                loading={loading}
              >
                Rate artist
              </SyncButton>
            ) : (
              <Typography className={classes.reviewText} loading={loading}>
                Buyer's rating
              </Typography>
            )
          ) : (
            <Typography className={classes.reviewText} loading={loading}>
              Artwork is inactive
            </Typography>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default ReviewCard;
