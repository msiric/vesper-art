import { makeStyles } from '@material-ui/core/styles';

const SignupStyles = makeStyles(() => ({
  card: {
    maxWidth: 420,
    marginTop: 50,
  },
  container: {
    display: 'Flex',
    justifyContent: 'center',
  },
  actions: {
    float: 'right',
  },
}));

export default SignupStyles;
