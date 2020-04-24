import { makeStyles } from '@material-ui/core/styles';

const Settings = makeStyles((muiTheme) => ({
  fixed: {
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  details: {
    margin: muiTheme.spacing(1, 1, 1, 0),
  },
  cover: {
    width: muiTheme.spacing(10),
    height: muiTheme.spacing(10),
    margin: muiTheme.spacing(2),
    borderRadius: '50%',
    flexShrink: 0,
    backgroundColor: muiTheme.palette.background.default,
  },
  icon: {
    fontSize: 18,
    padding: muiTheme.spacing(1),
  },
  user: {
    height: '15vh',
  },
  artwork: {
    height: '75vh',
  },
}));

export default Settings;
