import {
  CheckRounded as CheckIcon,
  EditOutlined as EditIcon,
  GetAppOutlined as DownloadIcon,
  ShoppingCartOutlined as PurchaseIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { featureFlags } from "../../../../common/constants";
import { formatArtworkPrice } from "../../../../common/helpers";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import List from "../../domain/List";
import ListItem from "../../domain/ListItem";
import ListItemIcon from "../../domain/ListItemIcon";
import ListItemText from "../../domain/ListItemText";
import Typography from "../../domain/Typography";
import AsyncButton from "../AsyncButton";
import SyncButton from "../SyncButton/index";
import pricingCardStyles from "./styles";

const PricingCard = ({
  artworkId,
  versionId,
  price,
  isSeller,
  isAvailable,
  heading,
  license,
  loading,
  submitting,
  list = [],
  noPriceFormat = "Free",
  handlePurchase = () => null,
  handleModalOpen = () => null,
}) => {
  const classes = pricingCardStyles();

  return (
    <Card className={classes.container}>
      <CardContent className={classes.content}>
        <Box className={classes.dataWrapper}>
          {!!price && (
            <Typography variant="h5" color="textSecondary">
              $
            </Typography>
          )}
          <Box className={classes.priceWrapper}>
            <Typography className={classes.price} loading={loading}>
              {formatArtworkPrice({
                price,
                prefix: "",
                freeFormat: noPriceFormat,
              })}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box className={classes.infoWrapper}>
          <Typography
            loading={loading}
            variant="subtitle1"
            className={classes.heading}
          >
            {!loading
              ? heading
              : "Fetching artwork's pricing information details"}
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
        {!isSeller ? (
          price ? (
            <SyncButton
              startIcon={<PurchaseIcon />}
              onClick={() => handlePurchase({ versionId, license })}
              // FEATURE FLAG - payment
              disabled={!featureFlags.payment}
              loading={loading}
            >
              Purchase
            </SyncButton>
          ) : (
            <AsyncButton
              startIcon={<DownloadIcon />}
              onClick={handleModalOpen}
              submitting={submitting}
              disabled={!isAvailable}
              loading={loading}
            >
              Download
            </AsyncButton>
          )
        ) : (
          <SyncButton
            component={RouterLink}
            to={`/artwork/${artworkId}/edit`}
            startIcon={<EditIcon />}
            loading={loading}
          >
            Edit artwork
          </SyncButton>
        )}
      </Box>
    </Card>
  );
};

export default PricingCard;
