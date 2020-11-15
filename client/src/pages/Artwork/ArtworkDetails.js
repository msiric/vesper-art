import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Container, Grid } from "@material-ui/core";
import {
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
} from "@material-ui/icons";
import { useSnackbar } from "notistack";
import queryString from "query-string";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { upload } from "../../../../common/constants.js";
import EmptySection from "../../components/EmptySection/index.js";
import PromptModal from "../../components/PromptModal/index.js";
import ArtistSection from "../../containers/ArtistSection/index.js";
import ArtworkActions from "../../containers/ArtworkActions/index.js";
import ArtworkInfo from "../../containers/ArtworkInfo/index.js";
import ArtworkPreview from "../../containers/ArtworkPreview/index.js";
import CommentSection from "../../containers/CommentSection/index.js";
import { useTracked as useUserContext } from "../../contexts/User.js";
import LicenseForm from "../../forms/LicenseForm/index.js";
import {
  deleteComment,
  getComment,
  getComments,
  getDetails,
} from "../../services/artwork.js";
import { postDownload } from "../../services/checkout.js";
import globalStyles from "../../styles/global.js";
import { Popover } from "../../styles/theme.js";
import { licenseValidation } from "../../validation/license.js";

const initialState = {
  loading: true,
  artwork: { comments: [] },
  license: null,
  height: 400,
  modal: {
    open: false,
  },
  popover: {
    id: null,
    anchorEl: null,
    open: false,
  },
  tabs: {
    value: 0,
  },
  edits: {},
  scroll: {
    comments: {
      hasMore: true,
      dataCursor: 0,
      dataCeiling: 10,
    },
  },
  highlight: {
    found: false,
    element: null,
  },
};

const ArtworkDetails = ({ match, location, socket }) => {
  const [userStore] = useUserContext();
  const [state, setState] = useState({ ...initialState });

  const setDefaultValues = () => ({
    licenseType: state.license,
    licenseAssignee: "",
    licenseCompany: "",
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    getValues,
    watch,
    reset,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(licenseValidation),
  });

  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();
  const globalClasses = globalStyles();

  const highlightRef = useRef(null);
  const query = queryString.parse(location.search);

  const scrollToHighlight = () => {
    if (highlightRef.current)
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  const fetchHighlight = async (commentId) => {
    try {
      const { data } = await getComment.request({
        artworkId: match.params.id,
        commentId,
      });
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchArtwork = async () => {
    try {
      setState({ ...initialState });
      const { data } = await getDetails.request({
        artworkId: match.params.id,
        dataCursor: initialState.scroll.comments.dataCursor,
        dataCeiling: initialState.scroll.comments.dataCeiling,
      });
      const foundHighlight =
        query.notif === "comment" && query.ref
          ? !!data.artwork.comments.filter(
              (comment) => comment._id === query.ref
            )[0]
          : false;
      const fetchedHighlight =
        !foundHighlight && query.notif === "comment" && query.ref
          ? await fetchHighlight(query.ref)
          : {};
      if (query.notif === "comment" && query.ref && !foundHighlight)
        enqueueSnackbar("Comment not found", {
          variant: "error",
        });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        license:
          data.artwork.current.use !== "included"
            ? "personal"
            : data.artwork.current.commercial !== null &&
              data.artwork.current.license === "commercial"
            ? "commercial"
            : null,
        artwork: data.artwork,
        height:
          data.artwork.current.height /
            (data.artwork.current.width / upload.artwork.fileTransform.width) +
          70,
        scroll: {
          ...prevState.scroll,
          comments: {
            ...prevState.scroll.comments,
            hasMore:
              data.artwork.comments.length <
              prevState.scroll.comments.dataCeiling
                ? false
                : true,
            dataCursor:
              prevState.scroll.comments.dataCursor +
              prevState.scroll.comments.dataCeiling,
          },
        },
        highlight: foundHighlight
          ? { ...initialState.highlight, found: true }
          : fetchedHighlight && fetchedHighlight.comment
          ? { found: false, element: fetchedHighlight.comment }
          : { ...initialState.highlight },
      }));
      if (!foundHighlight && !fetchedHighlight) {
        console.log("error");
      } else {
        scrollToHighlight();
      }
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleArtworkSave = (increment) => {
    setState((prevState) => ({
      ...prevState,
      artwork: {
        ...prevState.artwork,
        saves: prevState.artwork.saves + increment,
      },
    }));
  };

  const handlePurchase = async (id, license) => {
    history.push({
      pathname: `/checkout/${id}`,
      state: {
        license,
      },
    });
  };

  const handleDownload = async (values) => {
    try {
      await postDownload.request({
        versionId: state.artwork.current._id,
        data: values,
      });
      setState((prevState) => ({
        ...prevState,
        modal: {
          ...prevState.modal,
          open: false,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentAdd = (comment) => {
    setState((prevState) => ({
      ...prevState,
      artwork: {
        ...prevState.artwork,
        comments: [
          ...prevState.artwork.comments,
          {
            ...comment,
            owner: {
              _id: userStore.id,
              name: userStore.name,
              photo: userStore.photo,
            },
          },
        ],
      },
    }));
  };

  const handleCommentEdit = (id, content) => {
    setState((prevState) => ({
      ...prevState,
      artwork: {
        ...prevState.artwork,
        comments: prevState.artwork.comments.map((item) =>
          item._id === id
            ? {
                ...item,
                content: content,
                modified: true,
              }
            : item
        ),
      },
      edits: {
        ...prevState.edits,
        [id]: false,
      },
    }));
  };

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
      },
    }));
  };

  // $TODO ADD RESET FORM METHOD
  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
      },
    }));
  };

  const handleTabsChange = (e, index) => {
    setState((prevState) => ({
      ...prevState,
      tabs: { ...prevState.tabs, value: index },
    }));
  };

  const handleChangeIndex = (index) => {
    setState((prevState) => ({
      ...prevState,
      tabs: { ...prevState.tabs, value: index },
    }));
  };

  const handlePopoverOpen = (e, id) => {
    setState((prevState) => ({
      ...prevState,
      popover: {
        id: id,
        anchorEl: e.currentTarget,
        open: true,
      },
    }));
  };

  const handlePopoverClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      popover: {
        id: null,
        anchorEl: null,
        open: false,
      },
    }));
  };

  const handleCommentOpen = (id) => {
    setState((prevState) => ({
      ...prevState,
      edits: { ...prevState.edits, [id]: true },
      popover: {
        id: null,
        anchorEl: null,
        open: false,
      },
    }));
  };

  const handleCommentClose = (id) => {
    setState((prevState) => ({
      ...prevState,
      edits: { ...prevState.edits, [id]: false },
    }));
  };

  const handleCommentDelete = async (id) => {
    await deleteComment.request({
      artworkId: match.params.id,
      commentId: id,
    });
    setState((prevState) => ({
      ...prevState,
      artwork: {
        ...prevState.artwork,
        comments: prevState.artwork.comments.filter(
          (comment) => comment._id !== id
        ),
      },
      popover: {
        id: null,
        anchorEl: null,
        open: false,
      },
    }));
  };

  const loadMoreComments = async () => {
    try {
      const { data } = await getComments.request({
        artworkId: state.artwork._id,
        dataCursor: state.scroll.comments.dataCursor,
        dataCeiling: state.scroll.comments.dataCeiling,
      });
      const foundHighlight =
        !state.highlight.found && query.notif === "comment" && query.ref
          ? !!data.artwork.comments.filter(
              (comment) => comment._id === query.ref
            )[0]
          : false;
      setState((prevState) => ({
        ...prevState,
        loading: false,
        artwork: {
          ...prevState.artwork,
          comments: [...prevState.artwork.comments].concat(
            data.artwork.comments
          ),
        },
        scroll: {
          ...state.scroll,
          comments: {
            ...state.scroll.comments,
            hasMore:
              data.artwork.comments.length < state.scroll.comments.dataCeiling
                ? false
                : true,
            dataCursor:
              state.scroll.comments.dataCursor +
              state.scroll.comments.dataCeiling,
          },
        },
        highlight: foundHighlight
          ? { ...initialState.highlight, found: true }
          : { ...prevState.highlight },
      }));
      if (foundHighlight) {
        scrollToHighlight();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isSeller = () => userStore.id === state.artwork.owner._id;

  useEffect(() => {
    fetchArtwork();
  }, [location]);

  useEffect(() => {
    reset(setDefaultValues());
  }, [state.license]);

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {state.loading || state.artwork._id ? (
          <>
            <Grid item sm={12} md={8}>
              <ArtworkPreview
                version={state.artwork.current}
                height={state.height}
                loading={state.loading}
              />
              <br />
              <CommentSection
                artwork={state.artwork}
                edits={state.edits}
                scroll={state.scroll}
                highlight={state.highlight}
                queryRef={query ? query.ref : null}
                highlightRef={highlightRef}
                loadMoreComments={loadMoreComments}
                handleCommentAdd={handleCommentAdd}
                handleCommentEdit={handleCommentEdit}
                handleCommentClose={handleCommentClose}
                handlePopoverOpen={handlePopoverOpen}
                loading={state.loading}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <ArtistSection
                owner={state.artwork.owner}
                loading={state.loading}
              />
              <br />
              <ArtworkActions
                artwork={state.artwork}
                handleArtworkSave={handleArtworkSave}
                loading={state.loading}
              />
              <br />
              <ArtworkInfo
                artwork={state.artwork}
                tabs={state.tabs}
                license={state.license}
                handleTabsChange={handleTabsChange}
                handleChangeIndex={handleChangeIndex}
                handlePurchase={handlePurchase}
                handleModalOpen={handleModalOpen}
                loading={state.loading}
              />
            </Grid>
          </>
        ) : (
          <EmptySection label="Artwork not found" page />
        )}
        {/* Needs to be integrated with the license form */}
        <PromptModal
          open={state.modal.open}
          handleConfirm={handleSubmit(handleDownload)}
          handleClose={handleModalClose}
          ariaLabel="License information"
          promptTitle="License information"
          promptConfirm="Download"
          promptCancel="Close"
          isSubmitting={formState.isSubmitting}
        >
          <FormProvider control={control}>
            <form onSubmit={handleSubmit(handleDownload)}>
              <LicenseForm
                version={state.artwork.current}
                errors={errors}
                loading={state.loading}
              />
            </form>
          </FormProvider>
        </PromptModal>
      </Grid>
      {/* $TODO Separate component */}
      <Popover
        open={state.popover.open}
        anchorEl={state.popover.anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        width={120}
        transition
      >
        <Box>
          <Button
            variant="text"
            startIcon={<EditIcon />}
            onClick={() => handleCommentOpen(state.popover.id)}
            fullWidth
          >
            Edit
          </Button>
          <Button
            variant="text"
            startIcon={<DeleteIcon />}
            onClick={() => handleCommentDelete(state.popover.id)}
            fullWidth
          >
            Delete
          </Button>
        </Box>
      </Popover>
    </Container>
  );
};

export default ArtworkDetails;
