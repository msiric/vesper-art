import {
  Button,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useUserSettings } from "../../contexts/local/userSettings";
import settingsActionsStyles from "./styles.js";

const SettingsActions = () => {
  const loading = useUserSettings((state) => state.user.loading);
  const toggleModal = useUserSettings((state) => state.toggleModal);

  const classes = settingsActionsStyles();

  return (
    <Card className={classes.artworkContainer}>
      <CardContent p={32}>
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography>Deactivate user</Typography>
        </SkeletonWrapper>
        <SkeletonWrapper variant="text" loading={loading} width="100%">
          <Typography>
            Deactivating your account will result in all your data being
            deleted, except for essential artwork information (if you have any
            sold artwork as a seller) and essential license information (if you
            have any purchased artwork as a buyer) that are parts of other
            users' orders. This action is irreversible.
          </Typography>
        </SkeletonWrapper>
      </CardContent>
      <CardActions style={{ display: "flex", justifyContent: "flex-end" }}>
        <SkeletonWrapper loading={loading}>
          <Button variant="outlined" onClick={toggleModal}>
            Deactivate
          </Button>
        </SkeletonWrapper>
      </CardActions>
    </Card>
  );
};

export default SettingsActions;
