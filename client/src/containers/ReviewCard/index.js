import { StarsRounded as ReviewIcon } from "@material-ui/icons";
import queryString from "query-string";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SubHeading from "../../components/SubHeading/index";
import SyncButton from "../../components/SyncButton";
import { useUserStore } from "../../contexts/global/user";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import Rating from "../../domain/Rating/index";
import Typography from "../../domain/Typography";
import reviewCardStyles from "./styles";

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
  const shouldBlink = isHighlight && highlightRef.current;

  const history = useHistory();
  const classes = reviewCardStyles();

  useEffect(() => {
    fetchOrder({ orderId: paramId, query, highlightRef });
  }, []);

  return (
    <Card
      ref={isHighlight ? highlightRef : null}
      className={`${classes.container} ${shouldBlink ? classes.highlight : ""}`}
    >
      <CardContent className={classes.card}>
        <SubHeading text="Review" loading={loading} />
        {loading || review ? (
          <Box className={classes.wrapper}>
            <Rating value={review.rating} readOnly loading={loading} />
          </Box>
        ) : (
          <Box>
            <Typography className={classes.text} loading={loading}>
              {shouldReview ? "No rating left" : "No rating found"}
            </Typography>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Box className={classes.actions}>
          {loading || review ? (
            <Typography className={classes.text} loading={loading}>
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
              <Typography className={classes.text} loading={loading}>
                Buyer's rating
              </Typography>
            )
          ) : (
            <Typography className={classes.text} loading={loading}>
              Artwork is inactive
            </Typography>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default ReviewCard;
