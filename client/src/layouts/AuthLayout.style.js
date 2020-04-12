import { makeStyles } from '@material-ui/core/styles';

const AuthLayoutStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 'inherit',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default AuthLayoutStyles;
