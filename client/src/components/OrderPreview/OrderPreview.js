import { Box, Button, Card, CardMedia, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "../../constants/theme.js";

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
    height: 600,
    backgroundSize: "contain",
    margin: 20,
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

const OrderPreview = ({ version, handleDownload, shouldDownload }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Card className={classes.artworkPreviewCard}>
      <CardMedia
        className={classes.artworkPreviewMedia}
        image={version.cover}
        title={version.title}
      />
      <Divider />
      <Box>
        <Typography
          m={2}
          fontWeight="fontWeightBold"
          fontSize="h5.fontSize"
        >{`${version.title}, ${new Date(
          version.created
        ).getFullYear()}`}</Typography>
        <Typography m={2} fontSize="h6.fontSize">
          {version.description}
        </Typography>
      </Box>
      {shouldDownload && (
        <Box>
          <Divider />
          <Box p={2} display="flex" justifyContent="space-between">
            <Typography>Download high resolution artwork:</Typography>
            <Button onClick={handleDownload}>Download</Button>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default OrderPreview;
