import React, { useContext } from 'react';
import { Context } from '../Store/Store';
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
import { ax } from '../App/App';
import HomeStyles from './Home.style';

const Home = () => {
  const [state, dispatch] = useContext(Context);
  const classes = HomeStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}></Grid>
    </Grid>
  );
};

export default Home;
