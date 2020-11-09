import { Box, CircularProgress, IconButton } from "@material-ui/core";
import {
  Clear as ClearIcon,
  Error as ErrorIcon,
  Publish as UploadIcon,
} from "@material-ui/icons";
import React, { createRef, useEffect, useState } from "react";
import { artepunktTheme, Avatar, Typography } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import imageInputStyles from "./styles.js";

const ImageInput = ({
  field,
  setFieldValue,
  setFieldTouched,
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

  const showFileUpload = (e) => {
    if (!error && state.file && !noEmpty) {
      setFieldValue(field.name, null);
      setState((prevState) => ({ ...prevState, file: null }));
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
      reader.onloadend = () => {
        setState({
          loading: false,
          file: file,
          imagePreviewUrl: reader.result,
        });
        setFieldValue(field.name, file);
        setFieldTouched(field.name, true);
      };
    }
  };

  return (
    <Box className={classes.imageInputContainer}>
      <input
        className={classes.imageInputFile}
        id={field.name}
        name={field.name}
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
      <SkeletonWrapper loading={loading} variant={shape}>
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

export default ImageInput;
