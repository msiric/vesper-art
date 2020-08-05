import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import {
  Switch,
  TextField,
  Button,
  Link,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
} from '@material-ui/core';
import {
  FavoriteRounded as SaveIcon,
  CheckCircleRounded as ConfirmIcon,
} from '@material-ui/icons';
import { patchPreferences } from '../../services/user.js';
import { preferencesValidation } from '../../validation/preferences.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
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
        /*         await patchPreferences({
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
                        setFieldValue('displaySaves', e.target.checked)
                      }
                      checked={values.displaySaves}
                      inputProps={{
                        'aria-labelledby': 'switch-list-label-saves',
                      }}
                    />
                  )}
                </Field>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <Button
            type="submit"
            variant="contained"
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
