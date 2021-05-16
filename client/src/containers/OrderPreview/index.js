import { Box, Card, Divider } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import { artepunktTheme, Typography } from "../../styles/theme.js";
import orderPreviewStyles from "./styles.js";

const OrderPreview = () => {
  const userId = useUserStore((state) => state.id);

  const buyer = useOrderDetails((state) => state.order.data.buyer);
  const version = useOrderDetails((state) => state.order.data.version);
  const loading = useOrderDetails((state) => state.order.loading);

  const history = useHistory();
  const classes = orderPreviewStyles();

  return (
    <Card className={classes.artworkPreviewCard}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          maxHeight: 700,
          padding: artepunktTheme.padding.containerLg,
        }}
      >
        <SkeletonWrapper
          loading={loading}
          height={450}
          width="100%"
          style={{ margin: 24 }}
        >
          <ImageWrapper
            height={version.cover.height}
            width={version.cover.width}
            source={version.cover.source}
            placeholder={version.cover.dominant}
            styles={{
              maxWidth: 700 / (version.cover.height / version.cover.width) - 54,
              margin: "24px",
            }}
            loading={loading}
          />
        </SkeletonWrapper>
      </Box>
      <Divider />
      <Box p={2}>
        <SkeletonWrapper variant="text" loading={loading} height="60px">
          <Typography
            fontWeight="fontWeightBold"
            fontSize="h5.fontSize"
            className={classes.artworkPreviewTitle}
          >{`${version.title}, ${new Date(
            version.created
          ).getFullYear()}`}</Typography>
        </SkeletonWrapper>
        <SkeletonWrapper variant="text" loading={loading} height="40px">
          <Typography
            variant="body2"
            className={classes.artworkPreviewDescription}
          >
            {version.description || "Loading..."}
          </Typography>
        </SkeletonWrapper>
      </Box>
    </Card>
  );
};

export default OrderPreview;
