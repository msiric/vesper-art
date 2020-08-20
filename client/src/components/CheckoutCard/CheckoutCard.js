import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Collapse, Avatar, IconButton } from '@material-ui/core';
import {
  Card,
  Grid,
  Container,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from '../../constants/theme.js';

const useStyles = makeStyles((theme) => ({
  media: {
    minWidth: 75,
    width: '100%',
    paddingTop: '50%',
  },
}));

const CheckoutCard = ({ artwork }) => {
  const classes = useStyles();

  return (
    <Grid container p={0} my={4}>
      <Grid item xs={12} md={5} style={{ display: 'flex' }}>
        <Box display="flex" width="100%">
          <CardMedia
            className={classes.media}
            image={artwork.current.cover}
            title={artwork.current.title}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={7} className={classes.actions}>
        <Box display="flex" flexDirection="column">
          <CardHeader
            title={artwork.current.title}
            subheader={artwork.owner.name}
            px={2}
            md={{ px: 0 }}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {artwork.current.description}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CheckoutCard;
