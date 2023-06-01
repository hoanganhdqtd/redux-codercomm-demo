import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { COMMENTS_PER_POST } from "../../app/config";

import { getCurrentUserProfile } from "../user/userSlice";

// currentPageByPost: {post._id: currentPageValue, ...}
// commentsById: object of comment objects with comment._id as key
// commentsByPost: object of arrays of comment._id's
// with post._id as key => {post._id: [comment._id, ...], ...}
const initialState = {
  isLoading: false,
  error: null,
  commentsByPost: {},
  totalCommentsByPost: {},
  currentPageByPost: {},
  commentsById: {},
};

const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getCommentsSuccess(state, action) {
      state.isLoading = false;
      state.error = "";
      // console.log("action.payload", action.payload);

      // action.payload: {postId, comments: [{comment},...],
      // count, page, totalPages}

      const { postId, comments, count, page } = action.payload;

      comments.forEach(
        (comment) => (state.commentsById[comment._id] = comment)
      );
      // state.commentsByPost[postId] = comments
      //   .map((comment) => comment._id)
      //   .reverse();
      state.commentsByPost[postId] = comments.map((comment) => comment._id);

      state.totalCommentsByPost[postId] = count;
      state.currentPageByPost[postId] = page;
    },

    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    sendCommentReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { commentId, reactions } = action.payload;
      state.commentsById[commentId].reactions = reactions;
    },

    editCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { _id, content } = action.payload;
      state.commentsById[_id].content = content;
    },

    deleteCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      console.log("action", action.payload);
      const { _id, post } = action.payload;
      state.commentsByPost[post] = state.commentsByPost[post].filter(
        (commentId) => commentId !== _id
      );
      state.totalCommentsByPost[post] = state.commentsByPost[post].length;
    },
  },
});

export default slice.reducer;

export const getComments =
  ({ postId, page = 1, limit = COMMENTS_PER_POST }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        page: page,
        limit: limit,
      };
      const response = await apiService.get(`/posts/${postId}/comments`, {
        params,
      });
      // to pass postId and page to getCommentsSuccess
      // action.payload
      dispatch(
        slice.actions.getCommentsSuccess({
          ...response.data,
          postId,
          page,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const createComment =
  ({ postId, content }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post("/comments", {
        content,
        postId,
      });
      dispatch(slice.actions.createCommentSuccess(response.data));

      // to update comment list after creating new comment
      // without refreshing
      dispatch(getComments({ postId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

// {targetType: "Comment", targetId: comment._id,
// emoji: "like"/"dislike"}
// response.data {like, dislike}
export const sendCommentReaction =
  ({ commentId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Comment",
        targetId: commentId,
        emoji,
      });
      dispatch(
        slice.actions.sendCommentReactionSuccess({
          commentId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const editComment =
  ({ commentId, content }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.put(`/comments/${commentId}`, {
        content,
      });

      dispatch(slice.actions.editCommentSuccess(response.data));
      toast.success("Comment edited successfully");
      dispatch(getCurrentUserProfile());
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const deleteComment =
  ({ commentId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.delete(`/comments/${commentId}`);

      console.log("response", response);
      dispatch(slice.actions.deleteCommentSuccess(response.data));
      toast.success("Comment deleted successfully");
      dispatch(getCurrentUserProfile());
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };
