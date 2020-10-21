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
import {
  CheckRounded as CheckIcon,
  EditRounded as EditIcon,
  GetAppRounded as DownloadIcon,
  ShoppingCartRounded as PurchaseIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, Typography } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import pricingCardStyles from "./styles.js";

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
  const classes = pricingCardStyles();

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
              color="primary"
              variant="outlined"
              startIcon={<PurchaseIcon />}
              onClick={() => handlePurchase(versionId, license)}
            >
              Purchase
            </Button>
          ) : (
            <Button
              color="primary"
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleModalOpen}
            >
              Download
            </Button>
          )
        ) : (
          <Button
            color="primary"
            variant="outlined"
            component={RouterLink}
            to={`/edit_artwork/${artworkId}`}
            startIcon={<EditIcon />}
          >
            Edit artwork
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default PricingCard;
