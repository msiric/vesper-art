import { Box, Card, Divider } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { Typography } from "../../styles/theme.js";
import artworkPreviewStyles from "./styles.js";

const ArtworkPreview = ({ version = {}, height, loading }) => {
  const history = useHistory();
  const classes = artworkPreviewStyles();

  return (
    <Card
      className={classes.artworkPreviewCard}
      style={{
        minHeight: height,
        padding: 16,
      }}
    >
      <Box style={{ marginBottom: 12 }}>
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography fontWeight="fontWeightBold" fontSize="h5.fontSize">{`${
            version.title
          }, ${new Date(version.created).getFullYear()}`}</Typography>
        </SkeletonWrapper>
      </Box>
      <Divider />
      {/* <SkeletonWrapper loading={loading} width="100%">
        <CardMedia
          className={classes.artworkPreviewMedia}
          image={version.cover}
          title={version.title}
          style={loading ? { width: "100%", height } : { minHeight: height }}
        />
      </SkeletonWrapper> */}
      <ImageWrapper
        source={version.cover}
        placeholder={version.dominant}
        loading={loading}
      />
      <Box>
        <SkeletonWrapper
          variant="text"
          loading={loading}
          width="100%"
          height="120px"
        >
          <Typography mb={2} variant="body2">
            {version.description}
          </Typography>
        </SkeletonWrapper>
        <Divider />
        <Box>
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography mt={2} fontSize={12} fontStyle="italic">
              You are previewing a low resolution thumbnail of the original
              artwork
            </Typography>
          </SkeletonWrapper>
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography
              mb={2}
              fontSize={12}
              fontStyle="italic"
            >{`The original artwork dimensions (in pixels) are: ${version.width}x${version.height}`}</Typography>
          </SkeletonWrapper>
        </Box>
      </Box>
    </Card>
  );
};

export default ArtworkPreview;
