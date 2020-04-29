import { makeStyles } from '@material-ui/core/styles';

const DashboardStyles = makeStyles((muiTheme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 384,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 48,
  },
  media: {
    margin: 32,
    fontSize: '8rem',
  },
  heading: {
    marginBottom: 40,
  },
  text: {
    marginBottom: 16,
  },
}));

export default DashboardStyles;
