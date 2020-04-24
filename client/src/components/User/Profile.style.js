import { makeStyles } from '@material-ui/core/styles';

const Profile = makeStyles((muiTheme) => ({
  tabs: {
    backgroundColor: muiTheme.palette.background.paper,
  },
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
  paper: {
    height: '100%',
    width: '100%',
    padding: muiTheme.spacing(2),
    boxSizing: 'border-box',
    textAlign: 'center',
    color: muiTheme.palette.text.secondary,
  },
  user: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  avatar: {
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
  artwork: {
    height: '75vh',
  },
}));

export default Profile;
