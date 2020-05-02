import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import {
  Container,
  Grid,
  CircularProgress,
  Paper,
  IconButton,
  Icon,
  Divider,
  Typography,
} from '@material-ui/core';
import DashboardStyles from './Dashboard.style';

function Dashboard() {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({ loading: false });

  const classes = DashboardStyles();

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={12} className={classes.grid}>
              <div className={classes.header}>
                <div className={classes.headerContent}>
                  <Typography className={classes.heading} variant="h4">
                    {store.user.name}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={4} className={classes.grid}>
              <Paper className={classes.box}>
                <div className={classes.boxData}>
                  <Typography className={classes.boxMain}>4.3</Typography>
                  <Typography className={classes.boxAlt} color="textSecondary">
                    Rating
                  </Typography>
                </div>
                <Divider />
                <div className={classes.boxFooter}>
                  <Typography className={classes.text} color="textSecondary">
                    <span>WAT</span>:<b className={classes.count}>C</b>
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} className={classes.grid}>
              <Paper className={classes.box}>
                <div className={classes.boxData}>
                  <Typography className={classes.boxMain}>7</Typography>
                  <Typography className={classes.boxAlt} color="textSecondary">
                    Orders
                  </Typography>
                </div>
                <Divider />
                <div className={classes.boxFooter}>
                  <Typography className={classes.text} color="textSecondary">
                    <span>WAT</span>:<b className={classes.count}>C</b>
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} className={classes.grid}>
              <Paper className={classes.box}>
                <div className={classes.boxData}>
                  <Typography className={classes.boxMain}>$120</Typography>
                  <Typography className={classes.boxAlt} color="textSecondary">
                    Earnings
                  </Typography>
                </div>
                <Divider />
                <div className={classes.boxFooter}>
                  <Typography className={classes.text} color="textSecondary">
                    <span>WAT</span>:<b className={classes.count}>C</b>
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} className={classes.grid}></Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;
