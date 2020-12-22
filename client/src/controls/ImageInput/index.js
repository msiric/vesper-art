import { Box, CircularProgress, IconButton } from "@material-ui/core";
import {
  Clear as ClearIcon,
  Error as ErrorIcon,
  Publish as UploadIcon,
} from "@material-ui/icons";
import React, { createRef, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { artepunktTheme, Avatar, Typography } from "../../styles/theme.js";
import imageInputStyles from "./styles.js";

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
  loading,
}) => {
  const [state, setState] = useState({
    loading: false,
    file: null,
    imagePreviewUrl: null,
  });
  const fileUpload = createRef();

  const classes = imageInputStyles();

  useEffect(() => {
    if (preview && !state.imagePreviewUrl)
      setState((prevState) => ({
        ...prevState,
        file: preview,
        imagePreviewUrl: preview,
      }));
  }, [preview]);

  const showFileUpload = async (e) => {
    if (!error && state.file && !noEmpty) {
      setValue(name, null);
      setState((prevState) => ({ ...prevState, file: null }));
      await trigger(name);
    } else if (fileUpload) {
      fileUpload.current.value = null;
      fileUpload.current.click();
    }
  };

  const handleImageChange = (e) => {
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
  };

  return (
    <Box className={classes.imageInputContainer}>
      <input
        className={classes.imageInputFile}
        id={name}
        name={name}
        type="file"
        onChange={handleImageChange}
        ref={fileUpload}
      />
      {title && (
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography className={classes.imageInputTitle} variant="h6" noWrap>
            {title}
          </Typography>
        </SkeletonWrapper>
      )}
      <SkeletonWrapper
        loading={loading}
        variant={shape}
        height="100%"
        width="100%"
      >
        <Avatar
          m="auto"
          borderColor={artepunktTheme.palette.primary.main}
          className={classes.imageInputAvatar}
          onClick={showFileUpload}
          variant={shape}
          style={{ height, width }}
        >
          {state.loading ? (
            <Box className={classes.imageInputLoading}>
              <CircularProgress color="white" />
            </Box>
          ) : error ? (
            <Box className={classes.imageInputError}>
              <IconButton disableRipple className={classes.imageInputIcon}>
                <ErrorIcon fontSize="large" />
              </IconButton>
            </Box>
          ) : state.file ? (
            <Box className={classes.imageInputRemove}>
              <IconButton disableRipple className={classes.imageInputIcon}>
                <ClearIcon fontSize="large" />
              </IconButton>
            </Box>
          ) : (
            <Box className={classes.imageInputUpload}>
              <IconButton disableRipple className={classes.imageInputIcon}>
                <UploadIcon fontSize="large" />
              </IconButton>
            </Box>
          )}
          {state.file && (
            <img
              className={classes.imageInputPreview}
              src={state.imagePreviewUrl}
              alt="..."
            />
          )}
        </Avatar>
      </SkeletonWrapper>

      {error ? (
        <Typography
          variant="caption"
          color={artepunktTheme.palette.error.main}
          noWrap
          className={classes.imageInputText}
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
