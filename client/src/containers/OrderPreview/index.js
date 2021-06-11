import React from "react";
import { useHistory } from "react-router-dom";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import Divider from "../../domain/Divider";
import Typography from "../../domain/Typography";
import orderPreviewStyles from "./styles.js";

const OrderPreview = () => {
  const version = useOrderDetails((state) => state.order.data.version);
  const loading = useOrderDetails((state) => state.order.loading);

  const history = useHistory();
  const classes = orderPreviewStyles();

  return (
    <Card className={classes.container}>
      <Box className={classes.wrapper}>
        <ImageWrapper
          height={version.cover.height || 400}
          width={version.cover.width}
          source={version.cover.source}
          placeholder={version.cover.dominant}
          styles={{
            maxWidth: 700 / (version.cover.height / version.cover.width) - 54,
            margin: "24px",
          }}
          loading={loading}
        />
      </Box>
      <Divider />
      <Box className={classes.artworkInfo}>
        <Typography className={classes.artworkTitle} loading={loading}>{`${
          version.title
        }, ${new Date(version.created).getFullYear()}`}</Typography>
        <Typography variant="body2" loading={loading}>
          {version.description || "Loading..."}
        </Typography>
      </Box>
    </Card>
  );
};

export default OrderPreview;
