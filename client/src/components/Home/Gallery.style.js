import { makeStyles } from '@material-ui/core/styles';

const GalleryStyles = makeStyles((muiTheme) => ({
  paper: {
    height: '100%',
    width: '100%',
    padding: muiTheme.spacing(2),
    boxSizing: 'border-box',
    textAlign: 'center',
    color: muiTheme.palette.text.secondary,
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '100%',
  },
  shareContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButton: {
    display: 'flex',
    borderRadius: '50%',
    backgroundColor: 'white',
    height: 31,
    width: 31,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  socialButton: {
    display: 'flex',
  },
}));

export default GalleryStyles;
