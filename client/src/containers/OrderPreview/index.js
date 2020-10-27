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
    : hexToRgb(version.dominant);

  return (
    <Card className={classes.artworkPreviewCard}>
      <SkeletonWrapper loading={loading} width="100%">
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
              height={version.height}
              width={version.width}
              source={version.cover}
              placeholder={version.dominant}
              styles={{
                boxShadow: `0px 0px 40px 15px rgba(${r},${g},${b},0.75)`,
                maxWidth: 600 / (version.height / version.width) - 54,
                margin: "24px 0",
              }}
              loading={loading}
            />
          </SkeletonWrapper>
        </Box>
      </SkeletonWrapper>
      <Divider />
      <Box>
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography
            m={2}
            fontWeight="fontWeightBold"
            fontSize="h5.fontSize"
          >{`${version.title}, ${new Date(
            version.created
          ).getFullYear()}`}</Typography>
        </SkeletonWrapper>
        <SkeletonWrapper
          variant="text"
          loading={loading}
          width="100%"
          height="60px"
        >
          <Typography m={2} variant="body2">
            {version.description}
          </Typography>
        </SkeletonWrapper>
      </Box>
      {shouldDownload && (
        <Box>
          <Divider />
          <Box p={2} display="flex" justifyContent="space-between">
            <SkeletonWrapper variant="text" loading={loading} width="100%">
              <Typography>Download high resolution artwork:</Typography>
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
