import { makeStyles } from '@material-ui/core/styles';

const MainLayoutStyles = makeStyles((muiTheme) => ({
  backdrop: {
    zIndex: muiTheme.zIndex.drawer + 1,
    color: '#fff',
    background: '#fff',
  },
  root: {
    display: 'flex',
    flexFlow: 'column',
    height: '100vh',
  },
  paper: {
    padding: muiTheme.spacing(2),
    textAlign: 'center',
    color: muiTheme.palette.text.secondary,
  },
}));

export default MainLayoutStyles;
