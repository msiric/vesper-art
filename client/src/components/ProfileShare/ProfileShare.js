import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "../../context/Store.js";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Link as Anchor,
} from "@material-ui/core";
import {
  EditRounded as EditIcon,
  LinkRounded as CopyIcon,
} from "@material-ui/icons";
import {
  FacebookShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  RedditIcon,
  TwitterIcon,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";

const useStyles = makeStyles({
  profileShareContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  profileButtonWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 12,
  },
  profileCopyButton: {
    display: "flex",
    borderRadius: "50%",
    backgroundColor: "white",
    height: 31,
    width: 31,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "1px solid",
    marginRight: 10,
  },
  profileSocialButton: {
    display: "flex",
    marginRight: 10,
  },
});

const ProfileShare = ({ match }) => {
  const [store, dispatch] = useContext(Context);

  const url = window.location;
  const title = store.main.brand;
  const history = useHistory();
  const classes = useStyles();

  return (
    <Card className={classes.profileShareContainer}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Share this artist
        </Typography>
        <div className={classes.profileIconContainer}>
          <div className={classes.profileButtonWrapper}>
            <div className={classes.profileCopyButton}>
              <CopyToClipboard
                text={url}
                // onCopy={() =>
                //   enqueueSnackbar("Link copied", {
                //     variant: "success",
                //     autoHideDuration: 1000,
                //     anchorOrigin: {
                //       vertical: "top",
                //       horizontal: "center",
                //     },
                //   })
                // }
              >
                <CopyIcon />
              </CopyToClipboard>
            </div>
            Copy link
          </div>
          <div className={classes.profileButtonWrapper}>
            <FacebookShareButton
              url={url}
              quote={title}
              className={classes.profileSocialButton}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            Facebook
          </div>
          <div className={classes.profileButtonWrapper}>
            <TwitterShareButton
              url={url}
              title={title}
              className={classes.profileSocialButton}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            Twitter
          </div>
          <div className={classes.profileButtonWrapper}>
            <RedditShareButton
              url={url}
              title={title}
              windowWidth={660}
              windowHeight={460}
              className={classes.profileSocialButton}
            >
              <RedditIcon size={32} round />
            </RedditShareButton>
            Reddit
          </div>
          <div className={classes.profileButtonWrapper}>
            <WhatsappShareButton
              url={url}
              title={title}
              separator=":: "
              className={classes.profileSocialButton}
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            WhatsApp
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileShare;
