import { makeStyles } from '@material-ui/core/styles';

const ResetPasswordStyles = makeStyles(() => ({
  card: {
    maxWidth: 420,
    marginTop: 50,
  },
  container: {
    display: 'Flex',
    justifyContent: 'center',
  },
  form: {
    padding: 10,
  },
  actions: {
    float: 'right',
  },
}));

export default ResetPasswordStyles;
