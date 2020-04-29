import React from 'react';
import { Grow, Card, CardContent, Typography, Button } from '@material-ui/core';
import { MonetizationOnRounded as MonetizationIcon } from '@material-ui/icons';
import DashboardStyles from './Dashboard.style';

function Dashboard() {
  const classes = DashboardStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grow in>
          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <MonetizationIcon className={classes.media} />
              <Typography variant="subtitle1" className={classes.heading}>
                Start getting paid
              </Typography>
              <Typography color="textSecondary" className={classes.text}>
                On the next page you will be taken to Stripe's website where you
                will finish the onboarding process. This is mandatory in order
                to secure your balance and to generate payouts on demand. It
                goes without saying that having Stripe keep track of your
                balance and handle all the transactions is much more secure and
                reliable than doing this ourselves, so you can rest assured that
                your earnings are safe and protected at all times.
              </Typography>
              <Typography color="textSecondary" className={classes.text}>
                NOTE: We do not save any information that you enter on the next
                page except the ID that Stripe returns back
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                fullWidth
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </Grow>
      </div>
    </div>
  );
}

export default Dashboard;
