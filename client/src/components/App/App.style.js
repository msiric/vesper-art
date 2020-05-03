import { makeStyles } from '@material-ui/core/styles';

const AppStyles = makeStyles((muiTheme) => ({
  alert: {
    left: '50% !important',
    transform: 'translateX(-50%) !important',
  },
  fixed: {
    height: '100%',
  },
  container: {
    height: '100%',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
}));

export default AppStyles;
