import { withStyles, StepConnector } from '@material-ui/core';

const Connector = withStyles((theme) => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      background: theme.palette.primary.main,
    },
  },
  completed: {
    '& $line': {
      background: theme.palette.primary.main,
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}))(StepConnector);

export default Connector;
