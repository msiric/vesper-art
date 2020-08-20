import {
  Box,
  Button,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { CheckRounded as CheckIcon } from '@material-ui/icons';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, Typography } from '../../constants/theme.js';

const PricingCard = ({
  id,
  price,
  heading,
  list,
  license,
  handlePurchase,
  handleDownload,
}) => {
  return (
    <Card width="100%" height="100%">
      <CardContent p={32}>
        <Box display="flex" justifyContent="center">
          {price ? (
            <Typography variant="h5" color="textSecondary">
              $
            </Typography>
          ) : null}
          <Box alignItems="flex-end">
            <Typography fontSize={48}>{price || 'Free'}</Typography>
          </Box>
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column">
          <Typography variant="subtitle1" m={2}>
            {heading}
          </Typography>
          <List component="nav" aria-label="Features">
            {list.map((item) => (
              <ListItem>
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>

      <Box display="flex" justifyContent="center">
        {price ? (
          <Button
            onClick={() => handlePurchase(id, license)}
            variant="contained"
            color="primary"
          >
            Purchase
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDownload(id, license)}
          >
            Download
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default PricingCard;
