import { Box, Button, Container, Grid, Modal } from "@material-ui/core";
import {
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
} from "@material-ui/icons";
import queryString from "query-string";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { upload } from "../../../../common/constants.js";
import ArtistSection from "../../containers/ArtistSection/ArtistSection.js";
import ArtworkInfo from "../../containers/ArtworkInfo/ArtworkInfo.js";
import ArtworkPreview from "../../containers/ArtworkPreview/ArtworkPreview.js";
import CommentSection from "../../containers/CommentSection/CommentSection.js";
import LicenseForm from "../../containers/LicenseForm/LicenseForm.js";
import { Context } from "../../context/Store.js";
import {
  deleteComment,
  getComment,
  getComments,
  getDetails,
} from "../../services/artwork.js";
import { postDownload } from "../../services/checkout.js";
import globalStyles from "../../styles/global.js";
import { Popover } from "../../styles/theme.js";

const initialState = {
  loading: true,
  artwork: { comments: [] },
  license: "personal",
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
    loading: true,
    element: null,
  },
};

const ArtworkDetails = ({ match, location, socket }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({ ...initialState });

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

  const filterHighlight = () => {
    setState((prevState) => ({
      ...prevState,
      highlight: { ...initialState.highlight, found: true, loading: false },
    }));
    scrollToHighlight();
  };

  const fetchHighlight = async (commentId) => {
    try {
      setState((prevState) => ({
        ...prevState,
        highlight: { ...prevState.highlight, found: false, loading: true },
      }));
      const { data } = await getComment({
        artworkId: match.params.id,
        commentId,
      });
      if (data) {
        setState((prevState) => ({
          ...prevState,
          highlight: {
            element: data.comment,
            found: false,
            loading: false,
          },
        }));
        scrollToHighlight();
      } else {
        // $TODO Comment not found
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchArtwork = async () => {
    try {
      setState({ ...initialState });
      const { data } = await getDetails({
        artworkId: match.params.id,
        dataCursor: initialState.scroll.comments.dataCursor,
        dataCeiling: initialState.scroll.comments.dataCeiling,
      });
      // $TODO Check if comment and if ref is a valid ID
      if (!state.highlight.found && query.notif === "comment" && query.ref)
        fetchHighlight(query.ref);
      setState((prevState) => ({
        ...prevState,
        loading: false,
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
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
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
      const { data } = await postDownload({
        versionId: state.artwork.current._id,
        data: values,
      });
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
              _id: store.user.id,
              name: store.user.name,
              photo: store.user.photo,
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
    await deleteComment({
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
      const { data } = await getComments({
        artworkId: state.artwork._id,
        dataCursor: state.scroll.comments.dataCursor,
        dataCeiling: state.scroll.comments.dataCeiling,
      });
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
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const isSeller = () => store.user.id === state.artwork.owner._id;

  useEffect(() => {
    fetchArtwork();
  }, [location]);

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
                filterHighlight={filterHighlight}
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
          "$TODO Ne postoji"
        )}
        <Modal
          open={state.modal.open}
          handleClose={handleModalClose}
          ariaLabel="License modal"
        >
          <LicenseForm
            version={state.artwork.current}
            initial={{
              standalone: true,
              value: state.tabs.value === 0 ? "personal" : "commercial",
              submit: handleDownload,
            }}
            handleModalClose={handleModalClose}
          />
        </Modal>
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
