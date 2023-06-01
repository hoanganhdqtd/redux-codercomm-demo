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

const ConfirmPostDelete = ({ handlePostDelete, setIsPostDelete, postId }) => {
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm to delete</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton>
          <CloseIcon onClick={() => setIsPostDelete(false)} />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>{`Are you sure yout want to delete the post?`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setIsPostDelete(false)}
        >
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => handlePostDelete(postId)}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPostDelete;
