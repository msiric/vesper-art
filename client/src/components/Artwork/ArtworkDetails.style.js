import { makeStyles } from '@material-ui/core/styles';

const ArtworkDetailsStyles = makeStyles((muiTheme) => ({
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
  grid: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  paper: {
    height: '100%',
    width: '100%',
    padding: muiTheme.spacing(2),
    boxSizing: 'border-box',
    textAlign: 'center',
    color: muiTheme.palette.text.secondary,
  },
  cover: {
    paddingTop: '100%',
  },
  avatar: {
    paddingTop: '30%',
  },
  root: {
    width: '100%',
    backgroundColor: muiTheme.palette.background.paper,
  },
  fonts: {
    fontWeight: 'bold',
  },
  inline: {
    display: 'inline',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  license: {
    textTransform: 'capitalize',
  },
}));

export default ArtworkDetailsStyles;
