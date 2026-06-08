/* eslint-disable */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import Iconify from "src/components/iconify";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import { FeedbackView } from "../feedbackView";
export default function FeedbackTableRow({
  selected,
  name,
  profilePicture,
  email,
  mobile,
  isActive,
  feedback,
  status,
  handleClick,
  onViewUser,
  onUserDeleted,
  userId,
  addedOn,
  userType,
  suspended,
  onSuspendedUser,
  countryCode,
  block,
  feedbackCount,
  key,
  onUserStatusUpdated,
}) {
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [deleteUserId, setDeleteUserId] = useState(null);
  const [open, setOpen] = useState(null);
  // const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  // const [suspendReason, setSuspendReason] = useState("");
  // const [suspendUserId, setSuspendUserId] = useState(null);
  // const [isChecked, setIsChecked] = useState(suspended);
  // const [blockChecked, setBlockChecked] = useState(block);
  // const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  // const [blockUserId, setBlockUserId] = useState(null);
  // const [blockReason, setBlockReason] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // useEffect(() => {
  //   setIsChecked(suspended);
  //   setBlockChecked(block);
  // }, [suspended, block]);

  const token = localStorage.getItem("token");

  const showAlert = (status, message) => {
    Swal.fire({
      icon: status === 1 ? "success" : "error",
      title: status === 1 ? "Success" : "Error",
      text: message,
      confirmButtonColor: "#D74315",
      background: "#0F172A", // dark background
      color: "#FFFFFF",
      didOpen: () => {
        document.querySelector(".swal2-container").style.zIndex = 9999;
      },
    });
  };

  // const handleDeleteUserConfirm = async () => {
  //   try {
  //     const res = await axios.delete(
  //       `${import.meta.env.VITE_API_BASEURL}/admin/user/deleteUser`,
  //       {
  //         headers: { Authorization: `${token}` },
  //         data: { id: deleteUserId },
  //       }
  //     );

  //     showAlert(res.data.status, res.data.message);
  //     if (res.data.status === 1) onUserDeleted?.();
  //   } catch (error) {
  //     showAlert(0, error?.response?.data?.message || error.message);
  //   }

  //   setDeleteDialogOpen(false);
  //   setDeleteUserId(null);
  // };

  // const handleBlockConfirm = async () => {
  //   const action = blockChecked ? "unblock" : "block";

  //   try {
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_API_BASEURL}/admin/user/blockClients`,
  //       {
  //         userId: blockUserId,
  //         action,
  //         blockReason: action === "block" ? blockReason : "",
  //       },
  //       { headers: { Authorization: `${token}` } },
  //     );

  //     showAlert(res.data.status, res.data.message);
  //     if (res.data.status === 1) {
  //       setBlockChecked((prev) => !prev);
  //       onUserStatusUpdated?.();
  //     } else {
  //       onUserStatusUpdated?.();
  //       setBlockChecked(block);
  //     }
  //   } catch (err) {
  //     showAlert(0, err?.response?.data?.message || err.message);
  //     setBlockChecked(block);
  //   }

  //   setBlockDialogOpen(false);
  //   setBlockUserId(null);
  //   setBlockReason("");
  // };

  // const handleSuspendConfirm = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_API_BASEURL}/admin/user/suspendClients`,
  //       { userId: suspendUserId, reason: suspendReason || "" },
  //       { headers: { Authorization: `${token}` } }
  //     );

  //     showAlert(res.data.status, res.data.message);
  //     if (res.data.status === 1) setIsChecked(true);
  //     onUserStatusUpdated?.();
  //   } catch (err) {
  //     showAlert(0, err?.response?.data?.message || err.message);
  //   }

  //   setSuspendDialogOpen(false);
  //   setSuspendUserId(null);
  //   setSuspendReason("");
  // };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const formatMobileNumber = (code, number) => {
    if (!number) return code;
    const digits = number.replace(/\D/g, "");
    const formatted = digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    return `${code} ${formatted}`;
  };

  return (
    <>
      {/* Delete Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            boxShadow: "0px 8px 24px rgba(255, 255, 255, 0.25)", // softer shadow
            borderRadius: 2,
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.4)", // no blur
            backdropFilter: "none",
          },
        }}
        // sx={{
        //   maxWidth: {
        //     xs: "md", // for screen < 900px
        //     md: "md", // for screen ≥ 900px
        //   },
        // }}
      >
        <Box sx={{ justifyContent: "space-between", display: "flex" }}>
          <DialogTitle>Feedback Details</DialogTitle>
          <Button
            onClick={() => setViewDialogOpen(false)}
            sx={{
              fontSize: "larger",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            disableTouchRipple
          >
            x
          </Button>
        </Box>
        <DialogContent dividers>
          <FeedbackView
            userId={userId}
            onClose={() => setViewDialogOpen(false)}
          />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions> */}
      </Dialog>

      {/* <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteUserId(null);
            }}
          >
            No
          </Button>
          <Button color="error" onClick={handleDeleteUserConfirm}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Block Dialog */}
      {/* <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
        <DialogTitle>Confirm {blockChecked ? "Unblock" : "Block"}</DialogTitle>
        <DialogContent>
          Are you sure you want to {blockChecked ? "Unblock" : "Block"}{" "}
          <strong>{name}</strong>?
        </DialogContent>
        {!blockChecked && (
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason (optional)"
              type="text"
              fullWidth
              variant="standard"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button
            onClick={() => {
              setBlockDialogOpen(false);
              setBlockChecked(block);
              setBlockReason("");
            }}
          >
            No
          </Button>
          <Button onClick={handleBlockConfirm}>Yes</Button>
        </DialogActions>
      </Dialog> */}

      {/* Suspend Dialog */}
      {/* <Dialog
        open={suspendDialogOpen}
        onClose={() => setSuspendDialogOpen(false)}
      >
        <DialogTitle>Confirm {isChecked ? "Unsuspend" : "Suspend"}</DialogTitle>
        <DialogContent>
          Are you sure you want to {isChecked ? "Unsuspend" : "Suspend"}{" "}
          <strong>{name}</strong>?
        </DialogContent>
        {!isChecked && (
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason (optional)"
              type="text"
              fullWidth
              variant="standard"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button
            onClick={() => {
              setSuspendDialogOpen(false);
              setIsChecked(suspended);
              setSuspendReason("");
            }}
          >
            No
          </Button>
          <Button onClick={handleSuspendConfirm}>Yes</Button>
        </DialogActions>
      </Dialog> */}

      {/* Table Row */}
      <TableRow
        key={key}
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={name}
              src={`${
                profilePicture
                  ? `${import.meta.env.VITE_IMAGE_URL}${profilePicture}`
                  : ""
              }`}
            />
            {console.log(
              "🚀 ~ FeedbackTableRow ~ avatarUrl:",
              `${import.meta.env.VITE_IMAGE_URL}${profilePicture}`,
            )}
            <Typography variant="subtitle2" noWrap>
              {name || "N/A"}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{email || "N/A"}</TableCell>
        <TableCell>
          {addedOn
            ? new Date(addedOn).toLocaleString("en-AU", {
                timeZone: "Australia/Sydney",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "N/A"}
        </TableCell>{" "}
        {/* <TableCell>{formatMobileNumber(countryCode, mobile) || "N/A"}</TableCell> */}
        <TableCell>
          {feedbackCount} Feedback{feedbackCount > 1 ? "s" : ""}
        </TableCell>
        {/* <TableCell sx={{ textAlign: "left" }}>
          {userType === "Remote Worker" ? (
            <Box sx={{ ml: -1 }}>
              <Switch
                checked={isChecked}
                onChange={() => {
                  setSuspendUserId(userId);
                  setSuspendDialogOpen(true);
                }}
                color="error"
              />
            </Box>
          ) : (
            "N/A"
          )}
        </TableCell> */}
        {/* <TableCell>
          {userType === "Remote Worker" ? (
            <Box sx={{ ml: -1 }}>
              <Switch
                checked={blockChecked}
                onChange={() => {
                  setBlockUserId(userId);
                  setBlockDialogOpen(true);
                }}
                color="warning"
              />
            </Box>
          ) : (
            "N/A"
          )}
        </TableCell> */}
        <TableCell align="left actions-column">
          {/* <MenuItem
          onClick={() => {
            // onViewUser();
            handleCloseMenu();
            setViewDialogOpen(true);
          }}
        > */}
          <Iconify
          className="dt-view-btn dt-eye-icon"
            onClick={() => {
              handleCloseMenu();
              setViewDialogOpen(true);
            }}
            icon="eva:eye-fill"
            sx={{ mr: 2 }}
            style={{ cursor: "pointer" }}
          />
          {/* </MenuItem> */}
          {/* <IconButton onClick={(e) => setOpen(e.currentTarget)}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </TableCell>
      </TableRow>
    </>
  );
}

FeedbackTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  userType: PropTypes.any,
  handleClick: PropTypes.func,
  onViewUser: PropTypes.func,
  onDeleteUser: PropTypes.func,
  onSuspendedUser: PropTypes.func,
  onUserDeleted: PropTypes.func,
  name: PropTypes.any,
  email: PropTypes.any,
  mobile: PropTypes.string,
  userId: PropTypes.string,
  suspended: PropTypes.bool,
  selected: PropTypes.bool,
  block: PropTypes.bool,
};
