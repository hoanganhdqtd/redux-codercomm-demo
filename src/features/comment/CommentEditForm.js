import React, { useState } from "react";

import { Stack, Avatar, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { editComment } from "./commentSlice";

function CommentEditForm({ commentId, setIsCommentEdit }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editComment({ commentId, content }));
    setContent("");
    setIsCommentEdit(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" alignItems="center">
        <Avatar src={user.avatarUrl} alt={user.name} />
        <TextField
          fullWidth
          size="small"
          value={content}
          placeholder="Edit the comment"
          onChange={(event) => setContent(event.target.value)}
          sx={{
            ml: 2,
            mr: 1,
            "& fieldset": {
              borderWidth: `1px !important`,
              borderColor: (theme) =>
                `${theme.palette.grey[500_32]} !important`,
            },
          }}
        />
        <IconButton type="submit">
          <SendIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <IconButton onClick={() => setIsCommentEdit(false)}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </form>
  );
}

export default CommentEditForm;
