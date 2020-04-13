import { makeStyles } from '@material-ui/core/styles';

const EditArtworkStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: '100%',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
}));

export default EditArtworkStyles;
