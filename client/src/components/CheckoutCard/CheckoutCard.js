import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { CardHeader, CardMedia, Grid } from '../../constants/theme.js';

const useStyles = makeStyles((theme) => ({
  media: {
    minWidth: 50,
    width: '100%',
  },
}));

const CheckoutCard = ({ version }) => {
  const classes = useStyles();

  return (
    <Grid container p={0} my={4}>
      <Grid item xs={12} md={5} style={{ display: 'flex' }}>
        <Box display="flex" width="100%" py={0}>
          <CardMedia
            className={classes.media}
            image={version.cover}
            title={version.title}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={7} className={classes.actions}>
        <Box display="flex" flexDirection="column">
          <CardHeader
            title={version.title}
            subheader={version.artwork.owner.name}
            px={2}
            py={0}
            md={{ px: 0 }}
          />
          {/*           <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {version.description}
            </Typography>
          </CardContent> */}
        </Box>
      </Grid>
    </Grid>
  );
};

export default CheckoutCard;
