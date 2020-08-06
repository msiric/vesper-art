import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { EditRounded as EditIcon } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  accordion: {
    minHeight: 80,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  buttonColor: {
    color: "white",
    "& span": {
      color: "white",
      "& svg": {
        color: "white",
      },
    },
  },
}));

const EditButton = ({ artwork }) => {
  const classes = useStyles();

  return (
    <IconButton
      aria-label={"Edit artwork"}
      component={RouterLink}
      to={`/edit_artwork/${artwork._id}`}
      className={classes.buttonColor}
    >
      <EditIcon />
    </IconButton>
  );
};

export default EditButton;
