import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import {
  Container,
  Grid,
  CircularProgress,
  Paper,
  IconButton,
  Icon,
  Button,
  Divider,
  Typography,
} from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@material-ui/core/styles';
import ax from '../../axios.config';
import DashboardStyles from './Dashboard.style';

function Dashboard() {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({ loading: false, range: 'week' });

  const theme = useTheme();
  const classes = DashboardStyles();

  const fetchData = async () => {
    try {
      const { data } = await ax.get(`/api/user/${store.user.id}/statistics`);
      console.log(data);
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  function handleChangeRange(range) {
    setState((prevState) => ({ ...prevState, range }));
  }

  const buttons = [
    { key: 'week', text: 'This week' },
    { key: 'month', text: 'This month' },
    { key: 'year', text: 'This year' },
    { key: 'all', text: 'All time' },
  ];

  const data = [
    {
      id: 'japan',
      color: 'hsl(348, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 84,
        },
        {
          x: 'helicopter',
          y: 102,
        },
        {
          x: 'boat',
          y: 128,
        },
        {
          x: 'train',
          y: 112,
        },
        {
          x: 'subway',
          y: 46,
        },
        {
          x: 'bus',
          y: 46,
        },
        {
          x: 'car',
          y: 146,
        },
        {
          x: 'moto',
          y: 59,
        },
        {
          x: 'bicycle',
          y: 41,
        },
        {
          x: 'horse',
          y: 284,
        },
        {
          x: 'skateboard',
          y: 143,
        },
        {
          x: 'others',
          y: 140,
        },
      ],
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

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
            <Grid item md={12} className={classes.grid}>
              <Paper className={classes.actions}>
                <div className={classes.actionsContainer}>
                  <Typography className={classes.actionsHeading}>
                    Visualization
                  </Typography>
                  <div className={classes.buttonContainer}>
                    {buttons.map((button) => {
                      return (
                        <Button
                          key={button.key}
                          className={classes.button}
                          onClick={() => handleChangeRange(button.key)}
                          color={
                            state.range === button.key ? 'secondary' : 'default'
                          }
                          variant={
                            state.range === button.key ? 'contained' : 'text'
                          }
                        >
                          {button.text}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <Divider />
                <div className={classes.graphArea}>
                  <Grid item xs={12} md={8} className={classes.grid}>
                    <div className={classes.graph}>
                      <div className={classes.graphContainer}>
                        <ResponsiveLine
                          data={data}
                          margin={{
                            top: 50,
                            right: 110,
                            bottom: 50,
                            left: 60,
                          }}
                          xScale={{ type: 'point' }}
                          yScale={{
                            type: 'linear',
                            min: 0,
                            max: 'auto',
                            stacked: true,
                            reverse: false,
                          }}
                          curve="natural"
                          axisTop={null}
                          axisRight={null}
                          axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 15,
                            tickRotation: 0,
                            legend: '',
                            legendOffset: 35,
                            legendPosition: 'middle',
                          }}
                          axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 10,
                            tickRotation: 0,
                            legend: '',
                            legendOffset: -45,
                            legendPosition: 'middle',
                          }}
                          enableGridX={false}
                          enableGridY={false}
                          colors={{ scheme: 'nivo' }}
                          pointSize={8}
                          pointColor={{ theme: 'background' }}
                          pointBorderWidth={2}
                          pointBorderColor={{ from: 'serieColor' }}
                          pointLabel="y"
                          pointLabelYOffset={-12}
                          enableArea={true}
                          useMesh={true}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={4} className={classes.grid}>
                    <div className={classes.controls}>
                      <Paper className={classes.item}>
                        <div className={classes.itemData}>
                          <Typography className={classes.itemMain}>
                            4.3
                          </Typography>
                          <Typography
                            className={classes.itemAlt}
                            color="textSecondary"
                          >
                            Rating
                          </Typography>
                        </div>
                        <Divider />
                      </Paper>
                      <Paper className={classes.item}>
                        <div className={classes.itemData}>
                          <Typography className={classes.itemMain}>
                            7
                          </Typography>
                          <Typography
                            className={classes.itemAlt}
                            color="textSecondary"
                          >
                            Orders
                          </Typography>
                        </div>
                        <Divider />
                      </Paper>
                      <Paper className={classes.item}>
                        <div className={classes.itemData}>
                          <Typography className={classes.itemMain}>
                            $120
                          </Typography>
                          <Typography
                            className={classes.itemAlt}
                            color="textSecondary"
                          >
                            Earnings
                          </Typography>
                        </div>
                        <Divider />
                      </Paper>
                    </div>
                  </Grid>
                </div>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;
