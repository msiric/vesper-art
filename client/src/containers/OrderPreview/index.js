import { Box, Button, Card, Divider } from "@material-ui/core";
import { GetAppRounded as DownloadIcon } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import { hexToRgb } from "../../../../common/helpers.js";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { Typography } from "../../styles/theme.js";
import orderPreviewStyles from "./styles.js";

const OrderPreview = ({ version, handleDownload, shouldDownload, loading }) => {
  const history = useHistory();
  const classes = orderPreviewStyles();

  const { r, g, b } = loading
    ? { r: null, g: null, b: null }
    : hexToRgb(version.cover.dominant);

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
                boxShadow: `0px 0px 40px 15px rgba(${r},${g},${b},0.75)`,
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
      {shouldDownload && (
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
                onClick={handleDownload}
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
