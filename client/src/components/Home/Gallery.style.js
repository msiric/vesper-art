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
  scroller: {
    overflow: 'initial !important',
  },
  root: {
    flexGrow: 1,
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
    border: '1px solid',
  },
  socialButton: {
    display: 'flex',
  },
  link: {
    textDecoration: 'none',
  },
  artworkContainer: {
    position: 'relative',
    '&:hover': {
      '& $artworkHeader': {
        height: 30,
      },
      '& $artworkFooter': {
        height: 30,
      },
    },
  },
  artworkHeader: {
    width: 140,
    height: 0,
    position: 'absolute',
    top: 0,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    transition: 'height 0.5s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  artworkFooter: {
    width: 140,
    height: 0,
    position: 'absolute',
    bottom: 4,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    transition: 'height 0.5s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  artworkTitle: {
    color: 'white',
  },
  artworkOwner: {
    color: 'white',
  },
}));

export default GalleryStyles;
