import React from "react";
import { useHistory } from "react-router-dom";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardActionArea from "../../domain/CardActionArea";
import CardContent from "../../domain/CardContent";
import Typography from "../../domain/Typography";
import restorationCardStyles from "./styles";

const RestorationCard = ({ illustration, title, text, redirect }) => {
  const history = useHistory();

  const classes = restorationCardStyles();

  const handleRedirect = () => {
    history.push(redirect);
  };

  return (
    <Card className={classes.container} onClick={handleRedirect}>
      <CardActionArea className={classes.wrapper}>
        <Box className={classes.illustration}>{illustration}</Box>
        <CardContent className={classes.content}>
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
