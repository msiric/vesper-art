import { Box, Button, Card, Divider } from "@material-ui/core";
import { GetAppRounded as DownloadIcon } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import { Typography } from "../../styles/theme.js";
import orderPreviewStyles from "./styles.js";

const OrderPreview = ({ paramId }) => {
  const userId = useUserStore((state) => state.id);

  const buyer = useOrderDetails((state) => state.order.data.buyer);
  const version = useOrderDetails((state) => state.order.data.version);
  const loading = useOrderDetails((state) => state.order.loading);
  const downloadArtwork = useOrderDetails((state) => state.downloadArtwork);

  const shouldDownload = () => userId === buyer.id;

  const history = useHistory();
  const classes = orderPreviewStyles();

  return (
    <Card className={classes.artworkPreviewCard}>
      <SkeletonWrapper loading={loading} height="100%" width="100%">
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            maxHeight: 600,
          }}
        >
          <SkeletonWrapper
            loading={loading}
            height={300}
            width="100%"
            style={{ margin: 24 }}
          >
            <ImageWrapper
              height={version.cover.height}
              width={version.cover.width}
              source={version.cover.source}
              placeholder={version.cover.dominant}
              styles={{
                maxWidth:
                  600 / (version.cover.height / version.cover.width) - 54,
                margin: "24px",
              }}
              loading={loading}
            />
          </SkeletonWrapper>
        </Box>
      </SkeletonWrapper>
      <Divider />
      <Box p={2}>
        <SkeletonWrapper variant="text" loading={loading} height="60px">
          <Typography fontWeight="fontWeightBold" fontSize="h5.fontSize">{`${
            version.title
          }, ${new Date(version.created).getFullYear()}`}</Typography>
        </SkeletonWrapper>
        <SkeletonWrapper variant="text" loading={loading} height="60px">
          <Typography variant="body2">
            {version.description || "Loading..."}
          </Typography>
        </SkeletonWrapper>
      </Box>
      {shouldDownload() && (
        <Box>
          <Divider />
          <Box p={2} display="flex" justifyContent="space-between">
            <SkeletonWrapper variant="text" loading={loading}>
              <Typography>Download high resolution artwork:</Typography>
            </SkeletonWrapper>
            <SkeletonWrapper loading={loading}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => downloadArtwork({ orderId: paramId, userId })}
              >
                Download
              </Button>
            </SkeletonWrapper>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default OrderPreview;
