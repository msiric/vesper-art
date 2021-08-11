import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { formatMimeTypes } from "../../../../common/helpers";
import Link from "../../domain/Link";
import Paper from "../../domain/Paper";
import Popover from "../../domain/Popover";
import Typography from "../../domain/Typography";
import popperStyles from "./styles";

const UploadPopover = ({ label, size, dimensions, aspectRatio, types }) => {
  const [state, setState] = useState({ open: false, anchor: null });

  const classes = popperStyles();

  const handleToggle = (event) => {
    event.preventDefault();
    setState((prevState) => ({
      ...prevState,
      open: !prevState.open,
      anchor: prevState.anchor ? null : event.currentTarget,
    }));
  };

  return (
    <Box className={classes.container}>
      <Link component="button" variant="body2" onClick={handleToggle}>
        {label}
      </Link>
      <Popover
        open={state.open}
        anchorEl={state.anchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handleToggle}
        transition
      >
        <Paper className={classes.wrapper}>
          <Typography>{`Make sure the size of your artwork doesn't exceed ${size} MB.`}</Typography>
          <Typography>{`Minimum file dimensions are: ${dimensions.height}x${dimensions.width}.`}</Typography>
          <Typography>{`Allowed file aspect ratios range from 1:1 all the way to ${aspectRatio}:1`}</Typography>
          <Typography>{`Allowed file types are: ${formatMimeTypes(
            types
          )}`}</Typography>
        </Paper>
      </Popover>
    </Box>
  );
};

export default UploadPopover;
