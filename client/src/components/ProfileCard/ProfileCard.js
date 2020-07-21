import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { artepunktTheme } from '../../constants/theme.js';
import { formatDate } from '../../../../common/helpers.js';

const useStyles = makeStyles({
  profileCardContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: artepunktTheme.padding.container,
  },
  profileCardAvatar: {
    textAlign: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
  },
});

const ProfileCard = ({ user, handleModalOpen }) => {
  const classes = useStyles();

  return (
    <Card className={classes.profileCardContainer}>
      <CardMedia
        component="img"
        alt={user.name}
        image={user.photo}
        title={user.name}
        className={classes.profileCardAvatar}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2" align="center">
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="center"
        >
          {user.description || 'No description specified'}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="center"
        >
          {user.country || 'No country specified'}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          align="center"
        >
          {`Joined ${formatDate(new Date(user.created), 'MMM yyyy')}`}
        </Typography>
      </CardContent>
      {user.editable && (
        <CardActions>
          <Button size="small" color="primary" onClick={handleModalOpen}>
            Edit
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ProfileCard;
