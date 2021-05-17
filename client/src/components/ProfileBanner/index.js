import { Box } from "@material-ui/core";
import {
  LocationOnRounded as LocationIcon,
  PersonRounded as MemberIcon,
  StarRounded as StarIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { formatDate } from "../../../../common/helpers.js";
import globalStyles from "../../styles/global.js";
import {
  artepunktTheme,
  Avatar,
  Card,
  Typography,
} from "../../styles/theme.js";
import ShareButton from "../ShareButton/index.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import profileBannerStyles from "./styles.js";

const ProfileBanner = ({ profile, loading }) => {
  const globalClasses = globalStyles();
  const classes = profileBannerStyles();

  return (
    <Card className={classes.profileContainer}>
      <Box
        height={240}
        p={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor={artepunktTheme.palette.action.disabledBackground}
      ></Box>
      <Box
        className={clsx(
          globalClasses.gridContainer,
          classes.profileCardContainer
        )}
      >
        <Box className={classes.profileCardInfo}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <SkeletonWrapper loading={loading} variant="circle">
              <Avatar
                alt={profile.name}
                src={profile.avatar ? profile.avatar.source : null}
                title={profile.name}
                width={130}
                height={130}
                border={6}
                borderColor={artepunktTheme.palette.background.paper}
                mb={1}
                className={classes.profileCardAvatar}
              />
            </SkeletonWrapper>
          </Box>
          <Box className={classes.profileCardAbout}>
            <SkeletonWrapper
              variant="text"
              loading={loading}
              height="20px"
              width="100px"
            >
              <Typography
                variant="h4"
                color="inherit"
                className={classes.profileCardName}
                style={{ fontWeight: "bold" }}
              >
                {profile.name}
              </Typography>
            </SkeletonWrapper>
            <SkeletonWrapper loading={loading} height="20px" width="200px">
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "-12px",
                }}
              >
                {profile.rating > 0 && (
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <StarIcon
                      fontSize="small"
                      style={{
                        marginRight: "3px",
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      component="p"
                      align="center"
                    >
                      {profile.rating}
                    </Typography>
                  </Box>
                )}
                {profile.country && (
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <LocationIcon
                      fontSize="small"
                      style={{
                        marginRight: "3px",
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      component="p"
                      align="center"
                    >
                      {profile.country}
                    </Typography>
                  </Box>
                )}
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MemberIcon
                    fontSize="small"
                    style={{
                      marginRight: "3px",
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    component="p"
                    align="center"
                  >
                    {!loading && formatDate(profile.created, "MMM yy")}
                  </Typography>
                </Box>
              </Box>
            </SkeletonWrapper>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            marginTop="6px"
            flexGrow="1"
          >
            <ShareButton link={`/user/${profile.name}`} type="profile" />
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          flexDirection="column"
        >
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography
              variant="body1"
              color="inherit"
              style={{ fontWeight: "bold" }}
            >
              Description
            </Typography>
          </SkeletonWrapper>
          <SkeletonWrapper
            variant="text"
            loading={loading}
            width="100%"
            height="40px"
          >
            <Typography
              variant="body2"
              color="inherit"
              className={classes.profileCardDescription}
            >
              {profile.description || "Nothing here yet"}
            </Typography>
          </SkeletonWrapper>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileBanner;
