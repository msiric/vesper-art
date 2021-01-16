import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    margin: 24,
  },
  cardWrapper: {
    padding: "32px 24px",
  },
  cardIllustration: {
    width: "55%",
    paddingBottom: "55%",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    background: "#d3d3d3",
    margin: "0 auto 16px auto",
    "&>svg": {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      width: "80%",
      height: "auto",
    },
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 0,
    "&>h2": {
      fontWeight: "bold",
    },
  },
}));

const RestorationCard = ({ illustration, title, text, redirect }) => {
  const history = useHistory();
  const classes = useStyles();

  const handleRedirect = () => {
    history.push(redirect);
  };

  return (
    <Card className={classes.cardContainer} onClick={handleRedirect}>
      <CardActionArea className={classes.cardWrapper}>
        <Box className={classes.cardIllustration}>{illustration}</Box>
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {text}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RestorationCard;
