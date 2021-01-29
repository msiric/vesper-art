import create from "zustand";
import {
  deleteComment,
  getComment,
  getComments,
  patchComment,
  postComment,
} from "../../services/artwork";

const initialState = {
  comments: { data: [], loading: true, error: false },
  edits: {},
  popover: {
    id: null,
    anchorEl: null,
    open: false,
  },
  tabs: {
    value: 0,
  },
  scroll: {
    hasMore: true,
    cursor: "",
    limit: 5,
    retry: false,
  },
  highlight: {
    found: false,
    element: null,
  },
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

const resolveHighlight = async (comments, query, enqueueSnackbar) => {
  let foundHighlight = false;
  let fetchedHighlight = {};
  if (query.notif === "comment" && query.ref) {
    foundHighlight =
      !!comments.filter((comment) => comment.id === query.ref)[0] || false;
    fetchedHighlight = !foundHighlight ? await fetchHighlight(query.ref) : {};
    if (!foundHighlight) {
      enqueueSnackbar("Comment not found", {
        variant: "error",
      });
    }
  }
  return { foundHighlight, fetchedHighlight };
};

const initState = () => ({
  ...initialState,
});

const initActions = (set) => ({
  fetchComments: async ({
    artworkId,
    query,
    scrollToHighlight,
    enqueueSnackbar,
  }) => {
    const { data } = await getComments.request({
      artworkId,
      cursor: initialState.scroll.comments.cursor,
      limit: initialState.scroll.comments.limit,
    });
    const { foundHighlight, fetchedHighlight } = await resolveHighlight(
      data.comments,
      query,
      enqueueSnackbar
    );
    set((state) => ({
      loading: false,
    }));
  },
  addComment: async ({ artworkId, userData, values, reset }) => {
    try {
      const { data } = await postComment.request({
        artworkId,
        data: values,
      });
      set((state) => ({
        ...state,
        comments: [
          {
            ...data.payload,
            owner: {
              id: userData.id,
              name: userData.name,
              avatar: userData.avatar,
            },
          },
          ...state.comments,
        ],
        scroll: {
          ...state.scroll,
          comments: {
            ...state.scroll,
            cursor: data.payload.id,
          },
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
        artwork: {
          ...state.artwork,
          comments: state.comments.map((item) =>
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
      await deleteComment.request({
        artworkId,
        commentId,
      });
      set((state) => ({
        ...state,
        artwork: {
          ...state.state,
          comments: state.artwork.comments.filter(
            (comment) => comment.id !== commentId
          ),
        },
        popover: {
          id: null,
          anchorEl: null,
          open: false,
        },
      }));
    } catch (err) {}
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
});

export const useCommentsStore = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
