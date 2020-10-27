import { Box, Card, Divider } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { hexToRgb } from "../../../../common/helpers.js";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { Typography } from "../../styles/theme.js";
import artworkPreviewStyles from "./styles.js";

const ArtworkPreview = ({ version = {}, height, loading }) => {
  const history = useHistory();
  const classes = artworkPreviewStyles();

  const { r, g, b } = loading
    ? { r: null, g: null, b: null }
    : hexToRgb(version.dominant);

  return (
    <Card
      className={classes.artworkPreviewCard}
      style={{
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
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          maxHeight: 700,
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
              maxWidth: 700 / (version.height / version.width) - 54,
              margin: "24px 0",
            }}
            loading={loading}
          />
        </SkeletonWrapper>
      </Box>
      <Box>
        <Divider />
        <br />
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
