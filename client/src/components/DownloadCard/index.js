import { Box, Button, Card } from "@material-ui/core";
import { GetAppRounded as DownloadIcon } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import { Typography } from "../../styles/theme.js";
import downloadCardStyles from "./styles.js";

const DownloadCard = ({ paramId }) => {
  const userId = useUserStore((state) => state.id);

  const loading = useOrderDetails((state) => state.order.loading);
  const downloadArtwork = useOrderDetails((state) => state.downloadArtwork);

  const history = useHistory();
  const classes = downloadCardStyles();

  return (
    <Card>
      <Box className={classes.downloadCardWrapper}>
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography className={classes.downloadCardLabel}>
            Download high resolution artwork
          </Typography>
        </SkeletonWrapper>
        <SkeletonWrapper loading={loading}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            className={classes.downloadCardButton}
            onClick={() => downloadArtwork({ orderId: paramId, userId })}
          >
            Download
          </Button>
        </SkeletonWrapper>
      </Box>
    </Card>
  );
};

export default DownloadCard;
