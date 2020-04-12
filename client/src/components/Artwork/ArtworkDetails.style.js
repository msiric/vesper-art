import { makeStyles } from '@material-ui/core/styles';

const ArtworkDetailsStyles = makeStyles((muiTheme) => ({
  paper: {
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
}));

export default ArtworkDetailsStyles;
