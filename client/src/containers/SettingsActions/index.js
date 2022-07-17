import { DeleteForeverOutlined as DeactivateIcon } from "@material-ui/icons";
import React from "react";
import SyncButton from "../../components/SyncButton/index";
import { useUserSettings } from "../../contexts/local/userSettings";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Typography from "../../domain/Typography";
import settingsActionsStyles from "./styles";

const SettingsActions = () => {
  const loading = useUserSettings((state) => state.user.loading);
  const toggleModal = useUserSettings((state) => state.toggleModal);

  const classes = settingsActionsStyles();

  return (
    <Card>
      <CardContent>
        <Typography className={classes.heading} loading={loading}>
          Deactivate account
        </Typography>
        <Typography loading={loading}>
          Deactivating your account will result in all your data being deleted,
          except for essential artwork information (if you have any sold artwork
          as a seller) and essential license information (if you have any
          purchased artwork as a buyer) that are parts of other users' orders.
          This action is irreversible.
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <SyncButton
          color="secondary"
          onClick={toggleModal}
          startIcon={<DeactivateIcon />}
          loading={loading}
        >
          Deactivate
        </SyncButton>
      </CardActions>
    </Card>
  );
};

export default SettingsActions;
