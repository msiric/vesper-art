import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Link,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { formatDate } from '../../../../common/helpers.js';
import { withRouter } from 'react-router-dom';
import ProfileCard from '../../components/ProfileCard/ProfileCard.js';

const useStyles = makeStyles((muiTheme) => ({}));

const ArtistSection = ({ artwork }) => {
  const classes = useStyles();

  return (
    <ProfileCard
      user={artwork.owner}
      handleModalOpen={null}
      fullHeight={true}
    />
  );
};

export default withRouter(ArtistSection);
