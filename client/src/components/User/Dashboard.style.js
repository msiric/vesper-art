import { makeStyles } from '@material-ui/core/styles';

const DashboardStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: '100%',
  },
  container: {
    flex: 1,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px 24px 0 24px',
    backgroundColor: muiTheme.palette.primary.main,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heading: {
    padding: 'auto 0',
    [muiTheme.breakpoints.down('sm')]: {
      padding: 'auto 24px',
    },
  },
  box: {
    width: '100%',
  },
  boxData: {
    textAlign: 'center',
    padding: '12px auto 28px auto',
  },
  boxMain: {
    fontSize: 72,
    color: 'red',
  },
  boxAlt: {
    fontSize: 16,
  },
  boxFooter: {
    display: 'flex',
    alignItems: 'center',
    padding: 'auto 16px',
    height: 52,
  },
  text: {
    fontSize: 15,
    display: 'flex',
    width: '100%',
  },
  count: {
    padding: 'auto 8px',
  },
}));

export default DashboardStyles;
