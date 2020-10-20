import { Box, Button, Card, CardMedia, Divider } from "@material-ui/core";
import { GetAppRounded as DownloadIcon } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import { Typography } from "../../styles/theme.js";
import orderPreviewStyles from "./styles.js";

const OrderPreview = ({ version, handleDownload, shouldDownload, loading }) => {
  const history = useHistory();
  const classes = orderPreviewStyles();

  return (
    <Card className={classes.artworkPreviewCard}>
      <SkeletonWrapper loading={loading} width="100%">
        <CardMedia
          className={classes.artworkPreviewMedia}
          image={version.cover}
          title={version.title}
        />
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
