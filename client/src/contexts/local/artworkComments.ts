import create from "zustand";
import { isObjectEmpty } from "../../../../common/helpers";
import {
  deleteComment,
  getComment,
  getComments,
  patchComment,
  postComment,
} from "../../services/artwork";
import { resolveAsyncError, resolvePaginationId } from "../../utils/helpers";

const initialState = {
  comments: {
    data: [],
    fetching: false,
    initialized: false,
    hasMore: true,
    cursor: "",
    limit: 10,
    error: {
      refetch: false,
      message: "",
    },
  },
  edits: {},
  popover: {
    id: null,
    anchorEl: null,
    open: false,
  },
  highlight: {
    retrieved: false,
    fetched: false,
    element: null,
  },
  modal: {
    id: null,
    open: false,
  },
  isDeleting: false,
};

const scrollToHighlight = (highlightRef) => {
  if (highlightRef.current)
    highlightRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
};

const fetchHighlight = async (artworkId, commentId) => {
  try {
    const { data } = await getComment.request({
      artworkId,
      commentId,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

const resolveHighlight = async (
  artworkId,
  comments,
  data,
  query,
  highlight,
  enqueueSnackbar
) => {
  let highlightData = {};
  let foundHighlight = false;
  let fetchedHighlight = { ...highlight };
  if (query.notif === "comment" && query.ref) {
    if (comments.data.length) {
      foundHighlight = highlight.fetched
        ? !!data.find((comment) => comment.id === query.ref)
        : false;
      highlightData = foundHighlight
        ? { ...initialState.highlight, found: false, fetched: false }
        : { ...highlight };
    } else {
      foundHighlight = !!data.find((comment) => comment.id === query.ref);
      fetchedHighlight = !foundHighlight
        ? await fetchHighlight(artworkId, query.ref)
        : {};
      if (!foundHighlight && isObjectEmpty(fetchedHighlight)) {
        enqueueSnackbar("Comment not found", {
          variant: "error",
        });
      }
      highlightData = foundHighlight
        ? { ...initialState.highlight, found: true, fetched: false }
        : fetchedHighlight && fetchedHighlight.comment
        ? { found: false, fetched: true, element: fetchedHighlight.comment }
        : { ...initialState.highlight };
    }
  }
  return { highlightData, foundHighlight, fetchedHighlight };
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  fetchComments: async ({
    artworkId,
    query,
    highlightRef,
    enqueueSnackbar,
  }) => {
    try {
      set((state) => ({
        ...state,
        comments: {
          ...state.comments,
          fetching: true,
          error: {
            ...initialState.comments.error,
          },
        },
      }));
      const comments = get().comments;
      const highlight = get().highlight;
      const { data } = await getComments.request({
        artworkId,
        cursor: comments.cursor,
        limit: comments.limit,
      });
      const { highlightData, foundHighlight, fetchedHighlight } =
        await resolveHighlight(
          artworkId,
          comments,
          data.comments,
          query,
          highlight,
          enqueueSnackbar
        );
      set((state) => ({
        ...state,
        comments: {
          ...state.comments,
          data: [...state.comments.data, ...data.comments],
          fetching: false,
          initialized: true,
          error: { ...initialState.comments.error },
          hasMore: data.comments.length < state.comments.limit ? false : true,
          cursor: resolvePaginationId(data.comments),
        },
        highlight: { ...highlightData },
      }));
      if (foundHighlight || fetchedHighlight) {
        scrollToHighlight(highlightRef);
      }
    } catch (err) {
      set((state) => ({
        ...state,
        comments: {
          ...state.comments,
          initialized: true,
          fetching: false,
          error: resolveAsyncError(err, true),
        },
      }));
    }
  },
  addComment: async ({ artworkId, userData, values, reset }) => {
    try {
      const { data } = await postComment.request({
        artworkId,
        data: values,
      });
      set((state) => ({
        ...state,
        comments: {
          ...state.comments,
          data: [
            {
              ...data.payload,
              owner: {
                id: userData.id,
                name: userData.name,
                avatar: userData.avatar,
              },
            },
            ...state.comments.data,
          ],
          cursor: data.payload.id,
        },
      }));
      reset();
    } catch (err) {}
  },
  updateComment: async ({ artworkId, commentId, values }) => {
    try {
      await patchComment.request({
        artworkId,
        commentId,
        data: values,
      });
      set((state) => ({
        ...state,
        comments: {
          ...state.comments,
          data: state.comments.data.map((item) =>
            item.id === commentId
              ? {
                  ...item,
                  content: values.commentContent,
                  modified: true,
                }
              : item
          ),
        },
        edits: {
          ...state.edits,
          [commentId]: false,
        },
      }));
    } catch (err) {}
  },
  deleteComment: async ({ artworkId, commentId }) => {
    try {
      set((state) => ({
        ...state,
        isDeleting: true,
      }));
      await deleteComment.request({
        artworkId,
        commentId,
      });
      set((state) => ({
        ...state,
        comments: {
          ...state.comments,
          data: state.comments.data.filter(
            (comment) => comment.id !== commentId
          ),
        },
        popover: {
          id: null,
          anchorEl: null,
          open: false,
        },
        modal: {
          id: null,
          open: false,
        },
        isDeleting: false,
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        popover: {
          id: null,
          anchorEl: null,
          open: false,
        },
        modal: {
          id: null,
          open: false,
        },
        isDeleting: false,
      }));
    }
  },
  openComment: ({ commentId }) => {
    set((state) => ({
      ...state,
      edits: { ...state.edits, [commentId]: true },
      popover: {
        id: null,
        anchorEl: null,
        open: false,
      },
    }));
  },
  closeComment: ({ commentId }) => {
    set((state) => ({
      ...state,
      edits: { ...state.edits, [commentId]: false },
    }));
  },
  openPopover: ({ commentId, commentTarget }) => {
    set((state) => ({
      ...state,
      popover: {
        id: commentId,
        anchorEl: commentTarget,
        open: true,
      },
    }));
  },
  closePopover: () => {
    set((state) => ({
      ...state,
      popover: {
        id: null,
        anchorEl: null,
        open: false,
      },
    }));
  },
  openModal: ({ commentId }) => {
    set((state) => ({
      ...state,
      popover: {
        id: null,
        anchorEl: null,
        open: false,
      },
      modal: {
        ...state.modal,
        id: commentId,
        open: true,
      },
    }));
  },
  closeModal: () => {
    set((state) => ({
      ...state,
      modal: {
        ...state.modal,
        id: null,
        open: false,
      },
    }));
  },
  resetComments: () => {
    set({ ...initialState });
  },
});

export const useArtworkComments = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
