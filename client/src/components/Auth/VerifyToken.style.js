import { makeStyles } from '@material-ui/core/styles';

const VerifyTokenStyles = makeStyles(() => ({
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
}));

export default VerifyTokenStyles;
