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

const useStyles = makeStyles((muiTheme) => ({
  container: {
    padding: 0,
  },
  heading: {
    [muiTheme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: muiTheme.palette.secondary.main,
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
    [muiTheme.breakpoints.down("sm")]: {
      width: 175,
      height: 175,
    },
    [muiTheme.breakpoints.down(600)]: {
      width: 125,
      height: 125,
    },
    [muiTheme.breakpoints.down(500)]: {
      width: 110,
      height: 110,
    },
    [muiTheme.breakpoints.down(450)]: {
      width: 100,
      height: 100,
    },
    [muiTheme.breakpoints.down(400)]: {
      width: 90,
      height: 90,
    },
  },
}));

const WizardTimeline = ({ illustrations }) => {
  const classes = useStyles();

  return (
    <Timeline align="alternate" className={classes.container}>
      {illustrations.map((item, index) => (
        <TimelineItem>
          <TimelineOppositeContent className={classes.heading}>
            <Typography variant="h4" color="textSecondary">
              {`${index + 1}.`}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator className={classes.wrapper}>
            <TimelineDot className={classes.illustration}>
              {item.illustration}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className={classes.description}>
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
