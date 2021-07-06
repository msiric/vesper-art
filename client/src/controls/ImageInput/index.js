import {
  Clear as ClearIcon,
  Error as ErrorIcon,
  Publish as UploadIcon,
} from "@material-ui/icons";
import React, { createRef, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import CircularProgress from "../../domain/CircularProgress";
import IconButton from "../../domain/IconButton";
import Typography from "../../domain/Typography";
import { artepunktTheme } from "../../styles/theme";
import imageInputStyles from "./styles";

const Input = ({
  name,
  setValue,
  trigger,
  error,
  helperText,
  title,
  preview,
  shape,
  height,
  width,
  noEmpty,
  editable,
  loading = false,
}) => {
  const [state, setState] = useState({
    loading: false,
    file: null,
    imagePreviewUrl: null,
  });
  const fileUpload = createRef();

  const classes = imageInputStyles({ editable });

  useEffect(() => {
    if (preview && !state.imagePreviewUrl)
      setState((prevState) => ({
        ...prevState,
        file: preview,
        imagePreviewUrl: preview,
      }));
  }, [preview]);

  const showFileUpload = async (e) => {
    if (editable) {
      if (!error && state.file && !noEmpty) {
        setValue(name, null);
        setState((prevState) => ({ ...prevState, file: null }));
        await trigger(name);
      } else if (fileUpload) {
        fileUpload.current.value = null;
        fileUpload.current.click();
      }
    }
  };

  const handleImageChange = (e) => {
    if (editable) {
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target.files[0];
      if (file) {
        setState((prevState) => ({
          ...prevState,
          loading: true,
        }));
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          setState({
            loading: false,
            file: file,
            imagePreviewUrl: reader.result,
          });
          setValue(name, file);
          await trigger(name);
        };
      }
    }
  };

  return (
    <Box className={classes.container}>
      <input
        className={classes.file}
        id={name}
        name={name}
        type="file"
        onChange={handleImageChange}
        ref={fileUpload}
      />
      {title && (
        <Typography
          loading={loading}
          className={classes.title}
          variant="h6"
          noWrap
        >
          {title}
        </Typography>
      )}

      <Avatar
        className={classes.avatar}
        onClick={showFileUpload}
        shape={shape}
        style={{ height, width }}
        loading={loading}
      >
        {state.loading ? (
          <Box className={`${classes.input} ${classes.loading}`}>
            <CircularProgress color="white" />
          </Box>
        ) : error ? (
          <Box className={`${classes.input} ${classes.error}`}>
            <IconButton disableRipple className={classes.icon}>
              <ErrorIcon fontSize="large" />
            </IconButton>
          </Box>
        ) : state.file ? (
          <Box className={`${classes.input} ${classes.remove}`}>
            <IconButton disableRipple className={classes.icon}>
              <ClearIcon fontSize="large" />
            </IconButton>
          </Box>
        ) : (
          <Box className={`${classes.input} ${classes.upload}`}>
            <IconButton disableRipple className={classes.icon}>
              <UploadIcon fontSize="large" />
            </IconButton>
          </Box>
        )}
        {state.file && (
          <img
            className={classes.preview}
            src={state.imagePreviewUrl}
            alt="..."
          />
        )}
      </Avatar>
      {error ? (
        <Typography
          variant="caption"
          color={artepunktTheme.palette.error.main}
          noWrap
          className={classes.helper}
        >
          {helperText}
        </Typography>
      ) : null}
    </Box>
  );
};

const ImageInput = (props) => {
  const { control } = useFormContext();
  const error = { invalid: false, message: "" };
  if (props.errors && props.errors.hasOwnProperty(props.name)) {
    error.invalid = true;
    error.message = props.errors[props.name].message;
  }

  return (
    <Controller
      as={Input}
      control={control}
      error={error.invalid}
      helperText={error.message}
      {...props}
    />
  );
};

export default ImageInput;
