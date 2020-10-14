import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  CheckCircleRounded as ConfirmIcon,
  FavoriteRounded as SaveIcon,
} from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import { preferencesValidation } from "../../validation/preferences.js";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const EditPreferencesForm = ({ displaySaves }) => {
  const history = useHistory();

  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        displaySaves: displaySaves,
      }}
      enableReinitialize
      validationSchema={preferencesValidation}
      onSubmit={async (values, { resetForm }) => {
        /*         await patchPreferences.request({
          userId: store.user.id,
          data: values,
        });
        setState((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            displaySaves: values.displaySaves,
          },
        }));
        resetForm(); */
      }}
    >
      {({ values, errors, touched }) => (
        <Form className={classes.updatePassword}>
          <List>
            <ListItem>
              <ListItemIcon>
                <SaveIcon />
              </ListItemIcon>
              <ListItemText
                id="switch-list-label-saves"
                primary="Saved artwork"
              />
              <ListItemSecondaryAction>
                <Field name="displaySaves">
                  {({
                    field,
                    form: { setFieldValue, touched, errors },
                    meta,
                  }) => (
                    <Switch
                      {...field}
                      edge="end"
                      onChange={(e) =>
                        setFieldValue("displaySaves", e.target.checked)
                      }
                      checked={values.displaySaves}
                      inputProps={{
                        "aria-labelledby": "switch-list-label-saves",
                      }}
                    />
                  )}
                </Field>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<ConfirmIcon />}
            fullWidth
          >
            Update
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditPreferencesForm;
