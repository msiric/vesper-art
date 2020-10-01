import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import { artepunktTheme } from "../../constants/theme.js";
import { StarBorderRounded as StarIcon } from "@material-ui/icons";

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

const ProfileCard = ({ user, handleModalOpen, height }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.profileCardContainer}
      style={{ minHeight: height ? height : "auto" }}
    >
      <CardMedia
        component={RouterLink}
        to={`/user/${user.name}`}
        alt={user.name}
        image={user.photo}
        title={user.name}
        className={classes.profileCardAvatar}
      />
      <CardContent>
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
        {user.rating && (
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
        )}
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="center"
        >
          {user.description || "No description specified"}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="center"
        >
          {user.country || "No country specified"}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="center"
        >
          {`Joined ${formatDate(new Date(user.created), "MMM yyyy")}`}
        </Typography>
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
