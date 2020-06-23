import { makeStyles } from '@material-ui/core/styles';

const SearchResultsStyles = makeStyles(() => ({
  container: {
    flex: 1,
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
}));

export default SearchResultsStyles;
