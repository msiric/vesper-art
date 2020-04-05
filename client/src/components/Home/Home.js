import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import Gallery from './Gallery';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField,
  Button,
} from '@material-ui/core';
import ax from '../../axios.config';
import HomeStyles from './Home.style';

const Home = () => {
  const [state, dispatch] = useContext(Context);
  const [artwork, setArtwork] = useState([]);

  const classes = HomeStyles();

  const fetchArtwork = async () => {
    const { data } = await ax.get('/api/artwork');
    if (data.length) setArtwork(data);
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        {artwork.length ? <Gallery elements={artwork} /> : 'No artwork'}
      </Grid>
    </Grid>
  );
};

export default Home;
