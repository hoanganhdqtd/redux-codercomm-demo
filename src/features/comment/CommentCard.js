import React, { useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import apiService from "../../app/apiService";
import CommentEditForm from "./CommentEditForm";
import ConfirmCommentDelete from "./ConfirmCommentDelete";
import { useDispatch } from "react-redux";
import { deleteComment } from "./commentSlice";

// display each comment on a post
// comment: {_id, author: {_id, name}, content, createdAt,
//           post: post._id, reactions: {like, dislike},
//          updatedAt}

function CommentCard({ comment }) {
  const dispatch = useDispatch();
  const [isCommentEdit, setIsCommentEdit] = useState(false);
  const [isCommentDelete, setIsCommentDelete] = useState(false);

  // const { user } = useAuth();
  // const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMoreVertIconOpen = Boolean(anchorEl);

  const handleMoreVertIconOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreVertIconClose = () => {
    setAnchorEl(null);
  };

  const handleCommentEdit = async (commentId) => {
    console.log("edit comment");

    handleMoreVertIconClose();

    setIsCommentEdit(true);

    // try {
    //   handleMoreVertIconClose();
    //   const response = await apiService.put(`/comments/${commentId}`, {});
    //   setIsCommentEdit(false);
    //   return response.data;
    // } catch (error) {
    //   console.error(error);
    //   setIsCommentEdit(false);
    // }
  };

  const handleCommentDelete = async (commentId) => {
    console.log("delete comment", commentId);

    handleMoreVertIconClose();
    setIsCommentDelete(false);

    try {
      // const response = await apiService.delete(`/comments/${commentId}`);
      // setIsCommentDelete(false);
      dispatch(deleteComment({ commentId }));
      // return response.data;
    } catch (error) {
      // setIsCommentDelete(false);
      console.error(error);
    }
  };

  // const handleConmentEditSubmit = () => {};

  const menuId = "more-card-options-menu";
  const renderMoreOptions = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMoreVertIconOpen}
      onClose={handleMoreVertIconClose}
    >
      <MenuItem onClick={handleCommentEdit} sx={{ mx: 1 }}>
        Edit
      </MenuItem>

      <MenuItem onClick={() => setIsCommentDelete(true)} sx={{ mx: 1 }}>
        Delete
      </MenuItem>
    </Menu>
  );

  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(comment.createdAt)}
          </Typography>

          <IconButton>
            <MoreVertIcon
              sx={{ fontSize: 30 }}
              onClick={handleMoreVertIconOpen}
            />
          </IconButton>
        </Stack>

        {renderMoreOptions}

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />
        </Box>

        {isCommentEdit && (
          <CommentEditForm
            commentId={comment._id}
            setIsCommentEdit={setIsCommentEdit}
          />
        )}

        {isCommentDelete && (
          <ConfirmCommentDelete
            commentId={comment._id}
            setIsCommentDelete={setIsCommentDelete}
            handleCommentDelete={handleCommentDelete}
          />
        )}
      </Paper>
    </Stack>
  );
}

export default CommentCard;
