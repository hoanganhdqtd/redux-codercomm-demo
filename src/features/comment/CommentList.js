import React, { useEffect } from "react";

import { Pagination, Stack, Typography } from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getComments } from "./commentSlice";
import CommentCard from "./CommentCard";
import LoadingScreen from "../../components/LoadingScreen";
import { COMMENTS_PER_POST } from "../../app/config";

// list of comments on a post

// commentsByPost: object of arrays of comment._id's
// with post._id as key => {post._id: [comment._id, ...], ...}
// commentsById: object of comment objects with comment._id as key
// {comment._id: {comment}, ...}
// totalComments: {post._id: totalValue, ...}
// currentPageByPost: {post._id: currentPageValue, ...}

// comment: {_id, author: {_id, name}, content, createdAt,
//           post: post._id, reactions: {like, dislike},
//          updatedAt}

function CommentList({ postId }) {
  const {
    commentsByPost,
    commentsById,
    totalComments,
    isLoading,
    currentPage,
  } = useSelector(
    (state) => ({
      commentsByPost: state.comment.commentsByPost[postId],
      totalComments: state.comment.totalCommentsByPost[postId],
      currentPage: state.comment.currentPageByPost[postId] || 1,
      commentsById: state.comment.commentsById,
      isLoading: state.comment.isLoading,
    }),
    shallowEqual
  );
  const totalPages = Math.ceil(totalComments / COMMENTS_PER_POST);
  const dispatch = useDispatch();

  useEffect(() => {
    if (postId) dispatch(getComments({ postId }));
  }, [postId, dispatch]);

  let renderComments;

  // commentsByPost: array of comment._id's
  if (commentsByPost) {
    const comments = commentsByPost.map((commentId) => commentsById[commentId]);
    renderComments = (
      <Stack spacing={1.5}>
        {comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </Stack>
    );
  } else if (isLoading) {
    renderComments = <LoadingScreen />;
  }

  // comment pagination when totalComments > COMMENTS_PER_POST
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle" sx={{ color: "text.secondary" }}>
          {totalComments > 1
            ? `${totalComments} comments`
            : totalComments === 1
            ? `${totalComments} comment`
            : "No comment"}
        </Typography>
        {totalComments > COMMENTS_PER_POST && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => dispatch(getComments({ postId, page }))}
          />
        )}
      </Stack>
      {renderComments}
    </Stack>
  );
}

export default CommentList;
