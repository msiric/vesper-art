import { Box } from "@material-ui/core";
import {
  LocationOnRounded as LocationIcon,
  PersonRounded as MemberIcon,
  StarRounded as StarIcon,
} from "@material-ui/icons";
import React from "react";
import { formatDate } from "../../../../common/helpers.js";
import {
  artepunktTheme,
  Avatar,
  Card,
  Typography,
} from "../../styles/theme.js";
import ShareButton from "../ShareButton/index.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import profileBannerStyles from "./styles.js";

const ProfileBanner = ({ user, andleModalOpen, loading }) => {
  const classes = profileBannerStyles();

  return (
    <Card>
      <Box
        height={240}
        p={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor={artepunktTheme.palette.action.disabledBackground}
      ></Box>
      <Box
        minHeight={150}
        p={3}
        display="flex"
        justifyContent="center"
        flexDirection="column"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          marginTop="-70px"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <SkeletonWrapper loading={loading} variant="circle">
              <Avatar
                alt={user.name}
                src={user.avatar && user.avatar.source}
                title={user.name}
                width={130}
                height={130}
                border={6}
                borderColor={artepunktTheme.palette.background.paper}
                mb={1}
              />
            </SkeletonWrapper>
          </Box>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
            marginTop="36px"
            marginLeft="12px"
          >
            <SkeletonWrapper
              variant="text"
              loading={loading}
              height="20px"
              width="100px"
            >
              <Typography
                variant="h4"
                color="inherit"
                style={{ fontWeight: "bold" }}
              >
                {user.name}
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
                {user.rating > 0 && (
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
                      {user.rating}
                    </Typography>
                  </Box>
                )}
                {user.country && (
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
                      {user.country}
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
                    {!loading && formatDate(user.created, "MMM yy")}
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
            <ShareButton link="" type="user" />
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          flexDirection="column"
          height="50%"
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
            <Typography variant="body2" color="inherit">
              {user.description || "Nothing here yet"}
            </Typography>
          </SkeletonWrapper>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileBanner;
