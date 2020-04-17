import { makeStyles } from '@material-ui/core/styles';

const CartStyles = makeStyles((muiTheme) => ({
  artwork: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  root: {
    display: 'flex',
    width: '100%',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: muiTheme.spacing(1),
    paddingBottom: muiTheme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default CartStyles;
