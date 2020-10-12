import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  LocationOnRounded as LocationIcon,
  PersonRounded as MemberIcon,
  StarRounded as StarIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import { artepunktTheme } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/SkeletonWrapper.js";

const useStyles = makeStyles({
  profileCardContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: artepunktTheme.padding.container,
  },
  profileCardName: {
    marginTop: 10,
    display: "block",
    textAlign: "center",
    textDecoration: "none",
  },
  profileCardAvatar: {
    textAlign: "center",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
  },
});

const ProfileCard = ({ user, handleModalOpen, height, loading }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.profileCardContainer}
      style={{ minHeight: height ? height : "auto" }}
      loading={loading}
    >
      <SkeletonWrapper loading={loading} variant="circle">
        <CardMedia
          component={RouterLink}
          to={`/user/${user.name}`}
          alt={user.name}
          image={user.photo}
          title={user.name}
          className={classes.profileCardAvatar}
        />
      </SkeletonWrapper>
      <CardContent>
        <SkeletonWrapper
          variant="text"
          loading={loading}
          width="100%"
          height="40px"
        >
          <Typography
            component={RouterLink}
            to={`/user/${user.name}`}
            gutterBottom
            variant="h5"
            align="center"
            color="textPrimary"
            className={classes.profileCardName}
          >
            {user.name}
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
            {user.rating && (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "6px",
                }}
              >
                <StarIcon fontSize="small" />
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
                <LocationIcon fontSize="small" />
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
              <MemberIcon fontSize="small" />
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
      {user.editable && (
        <CardActions>
          <Button size="small" color="primary" onClick={handleModalOpen}>
            Edit
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ProfileCard;
