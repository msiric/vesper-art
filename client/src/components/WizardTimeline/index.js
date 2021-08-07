import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Timeline from "@material-ui/lab/Timeline";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import React from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  wrapper: {
    height: 350,
  },
  illustration: {
    position: "relative",
    width: 250,
    height: 250,
    padding: 0,
    "& > svg": {
      position: "absolute",
      width: "80%",
      height: "80%",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
  },
}));

const WizardTimeline = ({ illustrations }) => {
  const classes = useStyles();

  return (
    <Timeline align="alternate">
      {illustrations.map((item) => (
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              tesutlja
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator className={classes.wrapper}>
            <TimelineDot className={classes.illustration}>
              {item.illustration}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                {item.heading}
              </Typography>
              <Typography>{item.paragraph}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default WizardTimeline;
