import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
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

  const history = useHistory();

  const classes = artworkPreviewStyles();

  useEffect(() => {
    fetchArtwork({ artworkId: paramId });
  }, []);

  return (
    <Card className={classes.container}>
      <Box className={classes.imageWrapper}>
        <ImageWrapper
          height={version.height || 500}
          source={version.cover.source}
          placeholder={version.cover.dominant}
          addOverlay={true}
          loading={loading}
        />
      </Box>
      <Box>
        <Typography loading={loading} className={classes.title}>{`${
          version.title
        }, ${new Date(version.created).getFullYear()}`}</Typography>
        <Typography loading={loading} className={classes.description}>
          {version.description || "No description"}
        </Typography>
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
          >{`The original artwork dimensions (in pixels) are: ${version.media.width}x${version.media.height}`}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ArtworkPreview;
