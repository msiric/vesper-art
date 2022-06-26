import React from "react";
import { useHistory } from "react-router-dom";
import ImageWrapper from "../../components/ImageWrapper/index";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import Typography from "../../domain/Typography";
import orderPreviewStyles from "./styles";

const OrderPreview = () => {
  const version = useOrderDetails((state) => state.order.data.version);
  const loading = useOrderDetails((state) => state.order.loading);

  const history = useHistory();
  const classes = orderPreviewStyles();

  return (
    <Card className={classes.container}>
      <Box className={classes.previewWrapper}>
        <ImageWrapper
          height={version.cover.height || 500}
          source={version.cover.source}
          placeholder={version.cover.dominant}
          shouldBlur
          loading={loading}
        />
      </Box>
      <Box className={classes.detailsWrapper}>
        <Typography className={classes.title} loading={loading}>
          {!loading
            ? `${version.title}, ${new Date(version.created).getFullYear()}`
            : "Fetching artwork title"}
        </Typography>
        <Typography variant="body2" loading={loading}>
          {!loading
            ? version.description || "No description"
            : "Fetching artwork description containing detailed artwork information"}
        </Typography>
      </Box>
    </Card>
  );
};

export default OrderPreview;
