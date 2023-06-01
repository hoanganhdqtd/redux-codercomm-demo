import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { POSTS_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { getCurrentUserProfile } from "../user/userSlice";

// postsById: object of posts with their post._id prop as key
// currentPagePosts: array of current page's post_id's
const initialState = {
  isLoading: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // to not display posts from the other user's Profile
    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    },

    // in case of getting more posts, keep loaded posts
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      // action.payload = response.data (from getPosts())
      // action.payload: {posts: [{post},...], count, totalPages}
      // post: {reactions: {like, dislike}, _id, content, image,
      //        author: {_id, name, email, ..., postCount,
      //                 createdAt, updatedAt...},
      //        commentCount, createdAt, updatedAt
      //       }
      const { posts, count } = action.payload;
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        // {postsById: {post._id: {post}}}
        // post: {reactions: {like, dislike}, _id, content, image,
        //        author: {_id, name, email, ..., postCount,
        //                 createdAt, updatedAt...},
        //        commentCount, createdAt, updatedAt
        //       }

        // to avoid duplicate posts when loading more
        // after adding new post
        if (!state.currentPagePosts.includes(post._id))
          state.currentPagePosts.push(post._id);
      });
      state.totalPosts = count;
    },

    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const newPost = action.payload;
      if (state.currentPagePosts.length % POSTS_PER_PAGE === 0)
        state.currentPagePosts.pop();
      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },

    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, reactions } = action.payload;
      state.postsById[postId].reactions = reactions;
    },

    editPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      console.log("action.payload", action.payload);
      const { _id, content, image } = action.payload;
      state.postsById[_id].content = content;
      state.postsById[_id].image = image;
    },

    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      console.log("action.payload", action.payload);
      const { _id } = action.payload;
      state.currentPagePosts = state.currentPagePosts.filter(
        (postId) => postId !== _id
      );
    },
  },
});

export default slice.reducer;

export const getPosts =
  ({ userId, page = 1, limit = POSTS_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService.get(`/posts/user/${userId}`, {
        params,
      });
      // to erase PostLists from other user's Profile
      if (page === 1) dispatch(slice.actions.resetPosts());

      // to display new PostCard without having to refresh
      dispatch(slice.actions.getPostsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const createPost =
  ({ content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // upload image to cloudinary before sending post request
      // to get the image's URL
      const imageUrl = await cloudinaryUpload(image);

      // const response = await apiService.post("/posts", {
      //   content,
      //   image,
      // });

      const response = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      dispatch(slice.actions.createPostSuccess(response.data));
      toast.success("Post successfully");
      dispatch(getCurrentUserProfile());
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

// {targetType: "Post", targetId: post._id,
// emoji: "like"/"dislike"}
// response.data {like, dislike}
export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      dispatch(
        slice.actions.sendPostReactionSuccess({
          postId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const editPost =
  ({ postId, content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.put(`/posts/${postId}`, {
        content,
        image,
      });

      dispatch(slice.actions.editPostSuccess(response.data));
      toast.success("Post edited successfully");
      dispatch(getCurrentUserProfile());
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const deletePost =
  ({ postId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.delete(`/posts/${postId}`);

      dispatch(slice.actions.deletePostSuccess(response.data));
      toast.success("Post deleted successfully");
      dispatch(getCurrentUserProfile());
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };
