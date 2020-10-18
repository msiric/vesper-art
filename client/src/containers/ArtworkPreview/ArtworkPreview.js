import { Box, Card, CardMedia, Divider, Grow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router-dom";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import { Typography } from "../../styles/theme.js";

const useStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: "100%",
  },
  container: {
    flex: 1,
    height: "100%",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  artworkPreviewItem: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
  },
  paper: {
    height: "100%",
    width: "100%",
    padding: muiTheme.spacing(2),
    boxSizing: "border-box",
    textAlign: "center",
    color: muiTheme.palette.text.secondary,
  },
  artworkPreviewMedia: {
    height: "100%",
    margin: "30px 0",
    backgroundSize: "contain",
    borderRadius: 4,
  },
  avatar: {
    width: muiTheme.spacing(10),
    height: muiTheme.spacing(10),
    margin: muiTheme.spacing(2),
    borderRadius: "50%",
    flexShrink: 0,
    backgroundColor: muiTheme.palette.background.default,
  },
  artworkPreviewCard: {
    width: "100%",
    backgroundColor: muiTheme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  user: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  fonts: {
    fontWeight: "bold",
  },
  inline: {
    display: "inline",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  license: {
    textTransform: "capitalize",
  },
  postComment: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  editComment: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  editCommentForm: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  editCommentActions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  modified: {
    fontSize: 14,
    fontWeight: "normal",
  },
  noLink: {
    textDecoration: "none",
    color: "inherit",
  },
  moreOptions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));

const ArtworkPreview = ({ version = {}, height, loading }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Grow in>
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
        <SkeletonWrapper loading={loading} width="100%">
          <CardMedia
            className={classes.artworkPreviewMedia}
            image={version.cover}
            title={version.title}
            style={loading ? { width: "100%", height } : { minHeight: height }}
          />
        </SkeletonWrapper>
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
    </Grow>
  );
};

export default ArtworkPreview;
