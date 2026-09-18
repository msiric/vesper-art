import DynamicText from "@components/DynamicText";
import React, { useEffect } from "react";
import ImageWrapper from "../../components/ImageWrapper/index";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import Divider from "../../domain/Divider";
import Typography from "../../domain/Typography";
import artworkPreviewStyles from "./styles";

const ArtworkPreview = ({ paramId }) => {
  const version = useArtworkDetails((state) => state.artwork.data.current);
  const loading = useArtworkDetails((state) => state.artwork.loading);
  const fetchArtwork = useArtworkDetails((state) => state.fetchArtwork);
  const trackView = useArtworkDetails((state) => state.trackView);

  const classes = artworkPreviewStyles();

  useEffect(() => {
    fetchArtwork({ artworkId: paramId });
    trackView({ artworkId: paramId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  return (
    <Card className={classes.container}>
      <Box className={classes.imageWrapper}>
        <ImageWrapper
          height={version.height || 500}
          source={version.cover.source}
          placeholder={version.cover.dominant}
          shouldRandomize={false}
          loading={loading}
          addOverlay
          shouldBlur
        />
      </Box>
      <Box className={classes.imageDetails}>
        <Typography loading={loading} className={classes.title}>
          {!loading
            ? `${version.title}, ${new Date(version.created).getFullYear()}`
            : "Fetching artwork title"}
        </Typography>
        <DynamicText loading={loading} className={classes.description} preWrap>
          {!loading
            ? version.description || "No description"
            : "Fetching artwork description containing detailed artwork information"}
        </DynamicText>
        <Divider />
        <Box className={classes.disclaimerWrapper}>
          <Typography
            variant="body2"
            loading={loading}
            className={classes.disclaimer}
          >
            You are previewing a low resolution thumbnail of the original
            artwork
          </Typography>
          <Typography
            variant="body2"
            loading={loading}
            className={classes.disclaimer}
          >{`The original artwork dimensions (in pixels) are: ${
            version.media.width || 0
          }x${version.media.height || 0}`}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ArtworkPreview;
