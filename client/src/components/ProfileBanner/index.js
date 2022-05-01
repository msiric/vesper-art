import {
  LocationOnRounded as LocationIcon,
  PersonRounded as MemberIcon,
  StarRounded as StarIcon,
} from "@material-ui/icons";
import React from "react";
import { formatDate } from "../../../../common/helpers";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import Typography from "../../domain/Typography";
import ShareButton from "../ShareButton/index";
import profileBannerStyles from "./styles";

const ProfileBanner = ({ profile, loading }) => {
  const classes = profileBannerStyles();

  return (
    <Card className={classes.container}>
      <Box className={classes.banner}>
        <Box className={classes.share}>
          <ShareButton
            link={`/user/${profile.name}`}
            type="profile"
            shouldResize={true}
          />
        </Box>
      </Box>
      <Box className={classes.content}>
        <Box className={classes.infoWrapper}>
          <Box className={classes.avatarWrapper}>
            <Avatar
              variant="circle"
              src={profile.avatar ? profile.avatar.source : null}
              title={profile.name}
              loading={loading}
              className={classes.avatar}
            />
          </Box>
          <Box className={classes.aboutWrapper}>
            <Typography loading={loading} variant="h4" className={classes.name}>
              {!loading ? profile.name : "Username"}
            </Typography>
            <Box className={classes.detailsWrapper}>
              {loading && (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  component="p"
                  loading={loading}
                >
                  Fetching user details
                </Typography>
              )}
              {profile.rating > 0 && (
                <Box className={classes.item}>
                  <StarIcon fontSize="small" className={classes.icon} />
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                    className={classes.value}
                  >
                    {profile.rating}
                  </Typography>
                </Box>
              )}
              {profile.country && (
                <Box className={classes.item}>
                  <LocationIcon fontSize="small" className={classes.icon} />
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                    className={classes.value}
                  >
                    {profile.country}
                  </Typography>
                </Box>
              )}
              {profile.created && (
                <Box className={classes.item}>
                  <MemberIcon fontSize="small" className={classes.icon} />
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                    className={classes.value}
                  >
                    {!loading && formatDate(profile.created, "MMM ''yy")}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box className={classes.descriptionWrapper}>
          <Typography
            variant="body1"
            color="inherit"
            className={classes.label}
            loading={loading}
          >
            Description
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            loading={loading}
            className={classes.description}
          >
            {!loading
              ? profile.description || "Nothing here yet"
              : "Fetching user description details"}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileBanner;
