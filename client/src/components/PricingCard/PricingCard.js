import {
  Box,
  Button,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { CheckRounded as CheckIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, Typography } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/SkeletonWrapper.js";

const PricingCard = ({
  artworkId,
  versionId,
  price,
  isSeller,
  heading,
  list,
  license,
  handlePurchase,
  handleModalOpen,
  loading,
}) => {
  return (
    <Card width="100%" height="100%">
      <CardContent p={32}>
        <SkeletonWrapper loading={loading}>
          <Box display="flex" justifyContent="center">
            {price ? (
              <Typography variant="h5" color="textSecondary">
                $
              </Typography>
            ) : null}
            <Box alignItems="flex-end">
              <Typography fontSize={48}>{price || "Free"}</Typography>
            </Box>
          </Box>
        </SkeletonWrapper>

        <Divider />

        <Box display="flex" flexDirection="column">
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography variant="subtitle1" m={2}>
              {heading}
            </Typography>
          </SkeletonWrapper>
          <List component="nav" aria-label="Features">
            {list.map((item) => (
              <SkeletonWrapper loading={loading}>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              </SkeletonWrapper>
            ))}
          </List>
        </Box>
      </CardContent>

      <Box display="flex" justifyContent="center">
        {!isSeller() ? (
          price ? (
            <Button
              onClick={() => handlePurchase(versionId, license)}
              variant="contained"
              color="primary"
            >
              Purchase
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalOpen}
            >
              Download
            </Button>
          )
        ) : (
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to={`/edit_artwork/${artworkId}`}
          >
            Edit artwork
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default PricingCard;
