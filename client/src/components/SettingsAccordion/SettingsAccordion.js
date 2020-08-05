import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "../../context/Store.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Typography,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link as Anchor,
} from "@material-ui/core";
import {
  CheckCircleRounded as ConfirmIcon,
  MoreVertRounded as MoreIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  CancelRounded as CancelIcon,
  ExpandMoreRounded as UpIcon,
  ExpandLessRounded as DownIcon,
  FavoriteRounded as SaveIcon,
  ShareRounded as ShareIcon,
  ShoppingBasketRounded as PurchaseIcon,
  LinkRounded as CopyIcon,
  EmailRounded as EmailIcon,
  DoneRounded as CheckIcon,
  RemoveCircleRounded as DeactivateIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  accordion: {
    minHeight: 150,
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
}));

const SettingsAccordion = ({
  expanded,
  user,
  handlePanelChange,
  handleDeactivateUser,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion
        className={classes.accordion}
        expanded={expanded === "panel1"}
        onChange={handlePanelChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<UpIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>
            Change email address
          </Typography>
          <Typography className={classes.secondaryHeading}>
            {user.email}{" "}
            {user.verified ? (
              <Chip
                label="Verified"
                clickable
                color="primary"
                onDelete={() => null}
                deleteIcon={<CheckIcon />}
              />
            ) : (
              <Chip
                label="Not verified"
                clickable
                color="error"
                onDelete={() => null}
              />
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accordion}
        expanded={expanded === "panel2"}
        onChange={handlePanelChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<UpIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Change password</Typography>
          <Typography className={classes.secondaryHeading}>
            *********
          </Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accordion}
        expanded={expanded === "panel3"}
        onChange={handlePanelChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<UpIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>Preferences</Typography>
          <Typography className={classes.secondaryHeading}>
            Change saved artwork visibility
          </Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accordion}
        expanded={expanded === "panel4"}
        onChange={handlePanelChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<UpIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>
            Billing information
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Change billing information
          </Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accordion}
        expanded={expanded === "panel6"}
        onChange={handlePanelChange("panel6")}
      >
        <AccordionSummary
          expandIcon={<UpIcon />}
          aria-controls="panel6bh-content"
          id="panel6bh-header"
        >
          <Typography className={classes.heading}>Account settings</Typography>
          <Typography className={classes.secondaryHeading}>
            Deactivate account
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Deactivate account</Typography>
          <Button
            type="button"
            variant="contained"
            color="error"
            startIcon={<DeactivateIcon />}
            onClick={handleDeactivateUser}
            fullWidth
          >
            Deactivate
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default SettingsAccordion;
