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
  postComment: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  editComment: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  editCommentForm: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  editCommentActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  noLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  moreOptions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

export default ArtworkDetailsStyles;
