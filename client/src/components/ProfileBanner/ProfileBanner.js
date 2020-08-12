import React from 'react';
import { Box, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Typography, Card } from '../../constants/theme.js';
import { Link as RouterLink } from 'react-router-dom';
import { formatDate } from '../../../../common/helpers.js';
import { artepunktTheme } from '../../constants/theme.js';

const useStyles = makeStyles({
  profileCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: artepunktTheme.padding.container,
  },
  profileCardName: {
    marginTop: 10,
    display: 'block',
    textAlign: 'center',
    textDecoration: 'none',
  },
  profileCardAvatar: {
    textAlign: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
  },
});

const ProfileBanner = ({ user, handleModalOpen }) => {
  const classes = useStyles();

  return (
    <Card>
      <Box
        height={200}
        p={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor={artepunktTheme.palette.action.disabledBackground}
      ></Box>
      <Box
        height={150}
        p={3}
        display="flex"
        justifyContent="center"
        flexDirection="column"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          height="50%"
        >
          <Avatar
            alt={user.name}
            src={user.photo}
            title={user.name}
            width={130}
            height={130}
            border={4}
            borderColor={artepunktTheme.palette.background.paper}
            mt={-13}
            mr={2}
          />
          <Typography variant="h4" color="inherit" mt={-7}>
            {user.name}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="flex-end"
          justifyContent="space-between"
          height="50%"
        >
          <Typography variant="body2" color="inherit">
            {user.description || 'This user provided no description'}
          </Typography>
          <Button variant="contained" color="primary">
            Share artist
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileBanner;
