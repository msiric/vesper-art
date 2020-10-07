import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  LocationOnRounded as LocationIcon,
  MeetingRoomRounded as DoorIcon,
  StarRounded as StarIcon,
} from "@material-ui/icons";
import React from "react";
import { formatDate } from "../../../../common/helpers.js";
import {
  artepunktTheme,
  Avatar,
  Button,
  Card,
  Typography,
} from "../../styles/theme.js";

const useStyles = makeStyles({
  profileCardContainer: {
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

const ProfileBanner = ({ user, handleModalOpen }) => {
  const classes = useStyles();

  return (
    <Card>
      <Box
        height={200}
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
          <Box display="flex" alignItems="center">
            <Avatar
              alt={user.name}
              src={user.photo}
              title={user.name}
              width={130}
              height={130}
              border={4}
              borderColor={artepunktTheme.palette.background.paper}
              mb={1}
            />
          </Box>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
            marginTop="36px"
            marginLeft="12px"
          >
            <Typography variant="h4" color="inherit">
              {user.name}
            </Typography>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "-12px",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "12px",
                }}
              >
                <LocationIcon fontSize="small" />
                <Typography
                  variant="body1"
                  color="textSecondary"
                  component="p"
                  align="center"
                >
                  {user.country}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "12px",
                }}
              >
                <DoorIcon fontSize="small" />
                <Typography
                  variant="body1"
                  color="textSecondary"
                  component="p"
                  align="center"
                >
                  {formatDate(user.created, "MMM yy")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="flex-end"
          justifyContent="space-between"
          height="50%"
        >
          <Typography variant="body2" color="inherit">
            {user.description || "This user provided no description"}
          </Typography>
          <Button variant="contained" color="primary">
            Share artist
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileBanner;
