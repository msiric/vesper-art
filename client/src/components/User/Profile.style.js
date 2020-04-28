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
  shareContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  socialContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  copyButton: {
    display: 'flex',
    borderRadius: '50%',
    backgroundColor: 'white',
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid',
    margin: '0 10px',
    '& svg': {
      width: 18,
    },
  },
  socialButton: {
    display: 'flex',
    margin: '0 10px',
    width: 20,
  },
  link: {
    textDecoration: 'none',
  },
}));

export default Profile;
