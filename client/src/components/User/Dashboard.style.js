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
    height: 120,
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
  actions: {
    width: '100%',
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionsHeading: {
    fontSize: 16,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    padding: 'auto 16px',
  },
  graph: {
    display: 'flex',
    flexDirection: 'row',
  },
  graphContainer: {
    width: '100%',
    height: 420,
  },
  graphArea: {
    display: 'flex',
  },
  controls: {
    height: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  itemData: {
    textAlign: 'center',
    padding: '12px auto 28px auto',
  },
  itemMain: {
    fontSize: 42,
  },
  itemAlt: {
    fontSize: 16,
  },
}));

export default DashboardStyles;