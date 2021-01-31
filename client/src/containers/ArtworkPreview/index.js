import { Box, Card, Divider } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useArtworkStore } from "../../contexts/local/Artwork";
import { Typography } from "../../styles/theme.js";
import artworkPreviewStyles from "./styles.js";

const ArtworkPreview = ({ paramId }) => {
  const version = useArtworkStore((state) => state.artwork.data.current);
  const loading = useArtworkStore((state) => state.artwork.loading);
  const fetchArtwork = useArtworkStore((state) => state.fetchArtwork);

  const history = useHistory();
  const classes = artworkPreviewStyles();

  useEffect(() => {
    fetchArtwork({ artworkId: paramId });
  }, []);

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
            source={version.cover.source}
            placeholder={version.dominant}
            styles={{
              maxWidth: 700 / (version.height / version.width) - 54,
              margin: "24px",
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
            >{`The original artwork dimensions (in pixels) are: ${version.cover.width}x${version.cover.height}`}</Typography>
          </SkeletonWrapper>
        </Box>
      </Box>
    </Card>
  );
};

export default ArtworkPreview;
