import { Divider } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import Typography from "../../domain/Typography";
import artworkPreviewStyles from "./styles.js";

const ArtworkPreview = ({ paramId }) => {
  const version = useArtworkDetails((state) => state.artwork.data.current);
  const loading = useArtworkDetails((state) => state.artwork.loading);
  const fetchArtwork = useArtworkDetails((state) => state.fetchArtwork);

  const history = useHistory();

  const classes = artworkPreviewStyles();

  useEffect(() => {
    fetchArtwork({ artworkId: paramId });
  }, []);

  return (
    <Card className={classes.artworkPreviewContainer}>
      <Box className={classes.artworkPreviewTitleWrapper}>
        <Typography
          loading={loading}
          className={classes.artworkPreviewTitle}
        >{`${version.title}, ${new Date(
          version.created
        ).getFullYear()}`}</Typography>
      </Box>
      <Divider />
      <Box className={classes.artworkPreviewImageWrapper}>
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
        <Typography
          loading={loading}
          className={classes.artworkPreviewDescription}
        >
          {version.description}
        </Typography>
        <Box>
          <Typography
            variant="body2"
            loading={loading}
            mt={2}
            fontSize={12}
            fontStyle="italic"
          >
            You are previewing a low resolution thumbnail of the original
            artwork
          </Typography>
          <Typography
            variant="body2"
            mb={2}
            fontSize={12}
            fontStyle="italic"
            loading={loading}
          >{`The original artwork dimensions (in pixels) are: ${version.cover.width}x${version.cover.height}`}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ArtworkPreview;
