import { Avatar } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
  LocationOnRounded as LocationIcon,
  PersonRounded as MemberIcon,
  StarRounded as StarIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import profileCardStyles from "./styles.js";

const ProfileCard = ({ user, styles, loading }) => {
  const classes = profileCardStyles();

  return (
    <Card
      className={classes.profileCardContainer}
      style={{ ...styles }}
      loading={loading}
    >
      <SkeletonWrapper
        loading={loading}
        variant="circle"
        className={classes.profileCardWrapper}
      >
        <Box className={classes.profileCardWrapper}>
          <Avatar
            component={RouterLink}
            to={`/user/${user.name}`}
            alt={user.name}
            src={user.photo}
            title={user.name}
            className={classes.profileCardAvatar}
          />
        </Box>
      </SkeletonWrapper>
      <CardContent
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography
            component={RouterLink}
            to={`/user/${user.name}`}
            gutterBottom
            variant="h5"
            align="center"
            color="textPrimary"
            className={classes.profileCardName}
          >
            {user.name || "Artist name"}
          </Typography>
        </SkeletonWrapper>
        <SkeletonWrapper loading={loading} width="100%">
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            {user.rating > 0 && (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "6px",
                }}
              >
                <StarIcon fontSize="small" style={{ marginRight: "3px" }} />
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
                  marginRight: "6px",
                }}
              >
                <LocationIcon fontSize="small" style={{ marginRight: "3px" }} />
                <Typography
                  variant="body2"
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
              <MemberIcon fontSize="small" style={{ marginRight: "3px" }} />
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                align="center"
              >
                {user.created && formatDate(new Date(user.created), "MMM yy")}
              </Typography>
            </Box>
          </Box>
        </SkeletonWrapper>
        <SkeletonWrapper
          variant="text"
          loading={loading}
          width="100%"
          height="140px"
        >
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            align="center"
          >
            {user.description || "Nothing here yet"}
          </Typography>
        </SkeletonWrapper>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
