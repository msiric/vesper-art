import { Divider } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ImageWrapper from "../../components/ImageWrapper/index.js";
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
        <ImageWrapper
          height={version.height || 400}
          width={version.width}
          source={version.cover.source}
          placeholder={version.cover.dominant}
          styles={{
            maxWidth: 700 / (version.height / version.width) - 54,
            margin: "24px",
          }}
          loading={loading}
        />
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
        <Box className={classes.artworkPreviewDisclaimerWrapper}>
          <Typography
            variant="body2"
            loading={loading}
            className={classes.artworkPreviewDisclaimer}
          >
            You are previewing a low resolution thumbnail of the original
            artwork
          </Typography>
          <Typography
            variant="body2"
            loading={loading}
            className={classes.artworkPreviewDisclaimer}
          >{`The original artwork dimensions (in pixels) are: ${version.media.width}x${version.media.height}`}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ArtworkPreview;
