import { makeStyles } from '@material-ui/core/styles';

const GroupStyles = makeStyles((muiTheme) => ({
  paper: {
    height: '100%',
    width: '100%',
    padding: muiTheme.spacing(2),
    boxSizing: 'border-box',
    textAlign: 'center',
    color: muiTheme.palette.text.secondary,
  },
  scroller: {
    overflow: 'initial !important',
  },
  root: {
    flexGrow: 1,
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '100%',
  },
  link: {
    textDecoration: 'none',
  },
}));

export default GroupStyles;
