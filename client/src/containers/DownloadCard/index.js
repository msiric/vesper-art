import { GetAppRounded as DownloadIcon } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import Card from "../../domain/Card";
import Typography from "../../domain/Typography";
import downloadCardStyles from "./styles.js";

const DownloadCard = () => {
  const userId = useUserStore((state) => state.id);

  const order = useOrderDetails((state) => state.order.data);
  const loading = useOrderDetails((state) => state.order.loading);
  const downloadArtwork = useOrderDetails((state) => state.downloadArtwork);

  const history = useHistory();
  const classes = downloadCardStyles();

  return (
    <Card className={classes.container}>
      <Typography loading={loading} className={classes.label}>
        Download high resolution artwork
      </Typography>
      <AsyncButton
        startIcon={<DownloadIcon />}
        onClick={() => downloadArtwork({ orderId: order.id, userId })}
        loading={loading}
      >
        Download
      </AsyncButton>
    </Card>
  );
};

export default DownloadCard;