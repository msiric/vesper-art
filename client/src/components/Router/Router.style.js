import { makeStyles } from '@material-ui/core/styles';

const RouterStyles = makeStyles((muiTheme) => ({
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

export default RouterStyles;
