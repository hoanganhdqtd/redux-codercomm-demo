// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   IconButton,
//   Typography,
// } from "@material-ui/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
// import { Close } from "@material-ui/icons";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmCommentDelete = ({
  handleCommentDelete,
  setIsCommentDelete,
  commentId,
}) => {
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm to delete</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={() => setIsCommentDelete(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>{`Are you sure yout want to delete the comment?`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setIsCommentDelete(false)}
        >
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => handleCommentDelete(commentId)}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCommentDelete;
