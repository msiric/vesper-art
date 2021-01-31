import create from "zustand";
import {
  deleteComment,
  getComment,
  getComments,
  patchComment,
  postComment,
} from "../../services/artwork";
import { resolvePaginationId } from "../../utils/helpers";

const initialState = {
  comments: { data: [], loading: true, error: false },
  edits: {},
  popover: {
    id: null,
    anchorEl: null,
    open: false,
  },
  scroll: {
    hasMore: true,
    cursor: "",
    limit: 10,
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

const initActions = (set, get) => ({
  fetchComments: async ({
    artworkId,
    query,
    scrollToHighlight,
    enqueueSnackbar,
  }) => {
    try {
      set((state) => ({
        ...state,
        comments: { ...state.comments, loading: true, error: false },
        scroll: {
          ...state.scroll,
          retry: false,
        },
      }));
      const { cursor, limit } = get().scroll;
      const { data } = await getComments.request({
        artworkId,
        cursor: cursor,
        limit: limit,
      });
      /*     const { foundHighlight, fetchedHighlight } = await resolveHighlight(
        data.comments,
        query,
        enqueueSnackbar
      ); */
      set((state) => ({
        ...state,
        comments: {
          data: [...state.comments.data, ...data.comments],
          loading: false,
          error: false,
        },
        scroll: {
          ...state.scroll,
          hasMore: data.comments.length < state.scroll.limit ? false : true,
          cursor: resolvePaginationId(data.comments),
          retry: false,
        },
      }));
    } catch (err) {
      if (get().comments.data.length) {
        set((state) => ({
          ...state,
          scroll: {
            ...state.scroll,
            retry: true,
          },
        }));
      } else {
        set((state) => ({
          ...state,
          comments: {
            ...state.comments,
            loading: false,
            error: true,
          },
        }));
      }
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
        },
        scroll: {
          ...state.scroll,
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
  resetComments: () => {
    set({ ...initialState });
  },
});

export const useCommentsStore = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
