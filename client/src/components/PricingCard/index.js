import {
  CheckRounded as CheckIcon,
  EditRounded as EditIcon,
  GetAppRounded as DownloadIcon,
  ShoppingCartRounded as PurchaseIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { featureFlags } from "../../../../common/constants";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import List from "../../domain/List";
import ListItem from "../../domain/ListItem";
import ListItemIcon from "../../domain/ListItemIcon";
import ListItemText from "../../domain/ListItemText";
import Typography from "../../domain/Typography";
import SyncButton from "../SyncButton/index";
import pricingCardStyles from "./styles";

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
    <Card className={classes.container}>
      <CardContent className={classes.content}>
        <Box loading={loading} className={classes.dataWrapper}>
          {price ? (
            <Typography variant="h5" color="textSecondary">
              $
            </Typography>
          ) : null}
          <Box className={classes.priceWrapper}>
            <Typography className={classes.price}>{price || "Free"}</Typography>
          </Box>
        </Box>
        <Divider />
        <Box className={classes.infoWrapper}>
          <Typography
            loading={loading}
            variant="subtitle1"
            className={classes.heading}
          >
            {heading}
          </Typography>
          <List component="nav" aria-label="Features" disablePadding>
            {list.map((item) => (
              <ListItem loading={loading}>
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
      <Box className={classes.actionsWrapper}>
        {!isSeller() ? (
          price ? (
            <SyncButton
              startIcon={<PurchaseIcon />}
              onClick={() => handlePurchase({ versionId, license })}
              // FEATURE FLAG - payment
              disabled={!featureFlags.payment}
            >
              Purchase
            </SyncButton>
          ) : (
            <SyncButton startIcon={<DownloadIcon />} onClick={handleModalOpen}>
              Download
            </SyncButton>
          )
        ) : (
          <SyncButton
            component={RouterLink}
            to={`/artwork/${artworkId}/edit`}
            startIcon={<EditIcon />}
          >
            Edit artwork
          </SyncButton>
        )}
      </Box>
    </Card>
  );
};

export default PricingCard;
