import { GetAppOutlined as DownloadIcon } from "@material-ui/icons";
import React from "react";
import AsyncButton from "../../components/AsyncButton/index";
import { useUserStore } from "../../contexts/global/user";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import Card from "../../domain/Card";
import Typography from "../../domain/Typography";
import downloadCardStyles from "./styles";

const DownloadCard = () => {
  const userId = useUserStore((state) => state.id);

  const order = useOrderDetails((state) => state.order.data);
  const loading = useOrderDetails((state) => state.order.loading);
  const downloadArtwork = useOrderDetails((state) => state.downloadArtwork);

  const classes = downloadCardStyles();

  return (
    <Card className={classes.container}>
      <Typography loading={loading} className={classes.label}>
        Download high resolution artwork
      </Typography>
      <AsyncButton
        startIcon={<DownloadIcon />}
        onClick={() => downloadArtwork({ userId, orderId: order.id })}
        loading={loading}
      >
        Download
      </AsyncButton>
    </Card>
  );
};

export default DownloadCard;
