import { fade, makeStyles } from '@material-ui/core/styles';

const HeaderStyles = makeStyles((muiTheme) => ({
  grow: {
    flex: 1,
  },
  menuButton: {
    marginRight: muiTheme.spacing(2),
  },
  title: {
    display: 'none',
    textDecoration: 'none',
    color: '#000000',
    [muiTheme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: muiTheme.shape.borderRadius,
    backgroundColor: fade(muiTheme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(muiTheme.palette.common.white, 0.25),
    },
    marginRight: muiTheme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [muiTheme.breakpoints.up('sm')]: {
      marginLeft: muiTheme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: muiTheme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: muiTheme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${muiTheme.spacing(4)}px)`,
    transition: muiTheme.transitions.create('width'),
    width: '100%',
    [muiTheme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [muiTheme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [muiTheme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default HeaderStyles;
