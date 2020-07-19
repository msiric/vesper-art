import { makeStyles } from '@material-ui/core/styles';
import { artepunktTheme } from '../constants/theme.js';

const AuthLayoutStyles = makeStyles((muiTheme) => ({
  appRoot: {
    display: 'flex',
    flexFlow: 'column',
    minHeight: '100vh',
    height: '100%',
  },
  appBackdrop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    zIndex: muiTheme.zIndex.drawer + 1,
    color: '#fff',
    background: '#fff',
  },
  appContainer: {
    height: '100%',
    width: '100%',
    marginTop: artepunktTheme.margin.container,
    marginBottom: artepunktTheme.margin.container,
  },
}));

export default AuthLayoutStyles;
