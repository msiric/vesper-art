import { makeStyles } from '@material-ui/core/styles';
import { artepunktTheme } from '../constants/theme.js';

const MainLayoutStyles = makeStyles((muiTheme) => ({
  appContainer: {
    height: '100%',
    width: '100%',
    marginTop: artepunktTheme.margin.container,
    marginBottom: artepunktTheme.margin.container,
  },
  backdrop: {
    zIndex: muiTheme.zIndex.drawer + 1,
    color: '#fff',
    background: '#fff',
  },
  root: {
    display: 'flex',
    flexFlow: 'column',
    minHeight: '100vh',
  },
  paper: {
    padding: muiTheme.spacing(2),
    textAlign: 'center',
    color: muiTheme.palette.text.secondary,
  },
}));

export default MainLayoutStyles;
