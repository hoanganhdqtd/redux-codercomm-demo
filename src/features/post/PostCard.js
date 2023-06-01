import React, { useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { fDate } from "../../utils/formatTime";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import useAuth from "../../hooks/useAuth";
import apiService from "../../app/apiService";

import PostEditForm from "./PostEditForm";
import ConfirmPostDelete from "./ConfirmPostDelete";
import { useDispatch } from "react-redux";
import { deletePost, editPost } from "./postSlice";

// display each post from the user
// MoreVertIcon for options of delete, edit
// apiService.delete("/posts/${postId}")
// apiService.put("/posts/${postId}")
function PostCard({ post }) {
  const dispatch = useDispatch();

  const [isPostEdit, setIsPostEdit] = useState(false);
  const [isPostDelete, setIsPostDelete] = useState(false);

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

  // const handleLogout = async () => {
  //   try {
  //     handleMenuClose();
  //     await logout(() => {
  //       navigate("/login");
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // render PostForm to edit the post
  const handlePostEdit = async (postId, content, image) => {
    console.log("edit post", postId, content, image);
    setIsPostEdit(true);
    try {
      handleMoreVertIconClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostDelete = async (postId) => {
    console.log("delete post", postId);
    try {
      // handleMoreVertIconClose();
      // const response = await apiService.delete(`/${postId}`);
      // console.log("response", response);

      dispatch(deletePost({ postId }));
      setIsPostDelete(false);
      // return response.data;
    } catch (error) {
      setIsPostDelete(false);
      console.error(error);
    }
  };

  const menuId = "more-post-options-menu";
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
      <MenuItem onClick={handlePostEdit} sx={{ mx: 1 }}>
        Edit
      </MenuItem>

      <MenuItem
        onClick={() => {
          setIsPostDelete(true);
          handleMoreVertIconClose();
        }}
        sx={{ mx: 1 }}
      >
        Delete
      </MenuItem>
    </Menu>
  );

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <IconButton>
            <MoreVertIcon
              sx={{ fontSize: 30 }}
              onClick={handleMoreVertIconOpen}
            />
          </IconButton>
        }
      />

      {renderMoreOptions}

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>{post.content}</Typography>

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}

        <PostReaction post={post} />

        {isPostEdit && (
          <PostEditForm post={post} setIsPostEdit={setIsPostEdit} />
        )}
        {isPostDelete && (
          <ConfirmPostDelete
            handlePostDelete={handlePostDelete}
            setIsPostDelete={setIsPostDelete}
            postId={post._id}
          />
        )}

        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
