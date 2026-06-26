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
import Swal from "sweetalert2";
import { UserView } from "../userView";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tooltip from "@mui/material/Tooltip";

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  email,
  createdBy,
  mobile,
  isActive,
  handleClick,
  onViewUser,
  onUserDeleted,
  isProfileSetUp,
  userId,
  userType,
  suspended,
  onSuspendedUser,
  countryCode,
  block,
  key,
  deviceDetails,
  createdAt,
  onUserStatusUpdated,
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [open, setOpen] = useState(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendUserId, setSuspendUserId] = useState(null);
  const [isChecked, setIsChecked] = useState(suspended);
  const [blockChecked, setBlockChecked] = useState(block);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockUserId, setBlockUserId] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    setIsChecked(suspended);
    setBlockChecked(block);
  }, [suspended, block]);

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
  //       `${import.meta.env.VITE_API_BASEURL}/auth/deleteAdmin/${deleteUserId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
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
  const handleDeleteUserConfirm = async (userId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASEURL}/auth/deleteAdmin/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      showAlert(res.data.status, res.data.message);

      if (res.data.status === 1) {
        onUserDeleted?.();
      }
    } catch (error) {
      showAlert(0, error?.response?.data?.message || error.message);
    }
  };

  // const handleBlockConfirm = async () => {
  //   const action = blockChecked ? "unblock" : "block";

  //   try {
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_API_BASEURL}/auth/blockStatus`,
  //       {
  //         id: blockUserId,
  //         action,
  //         blockReason: blockReason ? blockReason : "",
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
  //       { headers: { Authorization: `${token}` } },
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

  const formatMobileNumber = (number) => {
    if (!number) return "";

    const digits = number.replace(/\D/g, "");

    let formatted = "";

    // If 10 digits (starts with 0) → local Australian format
    if (digits.length === 10) {
      formatted = digits.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
      return formatted; // no +61
    }

    // If 9 digits → international format
    if (digits.length === 9) {
      formatted = digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
      return `+61 ${formatted}`;
    }

    return digits; // fallback
  };

  const handleDeleteConfirmation = async (userId, userName) => {
    const result = await Swal.fire({
      title: "Confirm Delete",
      html: `Are you sure you want to delete <strong>${userName}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No",
      reverseButtons: true,
      customClass: {
        container: "logout-swal-container", // parent wrapper
        popup: "logout-swal-popup", // main modal
        title: "logout-swal-title",
        htmlContainer: "logout-swal-text",
        icon: "logout-swal-icon",
        confirmButton: "logout-swal-confirm btn btn-primary",
        cancelButton: "logout-swal-cancel btn btn-lighter-grey",
      },
    });

    if (result.isConfirmed) {
      handleDeleteUserConfirm(userId);
    }
  };

  return (
    <>
      <SwipeableDrawer
        className="custom-modal dialog-sidebar modal-dialog-slideout modal-dialog-scrollable"
        anchor="right"
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        onOpen={() => setViewDialogOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            width: {
              xs: "100%",
              sm: 400,
              md: 600,
            },
            overflowX: "hidden",
          },
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="mb-0 modal-title">User Details</h3>
          <button
            onClick={() => setViewDialogOpen(false)}
            className="btn-close in-close"
          ></button>
        </div>

        {/* User Details */}
        <div className="modal-body">
          <UserView
            userId={userId}
            deviceDetails={deviceDetails}
            onClose={() => setViewDialogOpen(false)}
          />
        </div>
      </SwipeableDrawer>
      {/* Delete Dialog */}
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
          className="btn btn-lighter-grey"
            variant="outlined"
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteUserId(null);
            }}
          >
            No
          </Button>
          <Button
          className="btn btn-primary"
            variant="contained"
            onClick={handleDeleteUserConfirm}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Block Dialog */}
      {/* <Dialog
        open={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
        PaperProps={{
          sx: {
            boxShadow: "0px 8px 24px rgba(255, 255, 255, 0.25)",
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "none", // 🔥 removes blur
          },
        }}
      >
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
              src={
                avatarUrl
                  ? `${import.meta.env.VITE_IMAGE_URL}${avatarUrl}`
                  : avatarUrl
              }
            />
            <Typography variant="subtitle2" noWrap>
              {name || "N/A"}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email || "N/A"}</TableCell>

        <TableCell>{createdBy || "N/A"}</TableCell>

        <TableCell>{mobile ? formatMobileNumber(mobile) : "N/A"}</TableCell>

        {/* <TableCell>{userType || "N/A"}</TableCell> */}
        <TableCell>
          <span
            className={`status-badge badge ${
              isProfileSetUp === 0
                ? "danger-box"
                : isProfileSetUp === 1
                ? "success-box"
                : ""
            }`}
          >
            {isProfileSetUp === 0
              ? "Incomplete"
              : isProfileSetUp === 1
              ? "Complete"
              : "N/A"}
          </span>
        </TableCell>

        <TableCell>{createdAt || "N/A"}</TableCell>

        {/* <TableCell>
          {isActive === true ? "Active" : "Inactive" || "N/A"}
        </TableCell>

        <TableCell>
          <Box sx={{ ml: -1 }}>
            <Switch
              checked={blockChecked}
              onChange={() => {
                setBlockUserId(userId);
                setBlockDialogOpen(true);
              }}
              style={{ color: blockChecked ? "#00A76F" : undefined }}
            />
          </Box>
          {block === true ? "Blocked" : "Unblocked" || "N/A"}
        </TableCell> */}
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

        <TableCell align="left">
          {/* <IconButton onClick={(e) => setOpen(e.currentTarget)}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
          <Tooltip title="View Details" placement="top" arrow>
            <Iconify
              className="dt-view-btn dt-eye-icon"
              onClick={() => {
                // onViewUser();
                handleCloseMenu();
                setViewDialogOpen(true);
              }}
              icon="eva:eye-fill"
              sx={{ mr: 2 }}
            />
          </Tooltip>
          <Tooltip title="Delete User" placement="top" arrow>
            <Iconify
              className="dt-view-btn dt-delet-icon"
              onClick={() => {
                handleCloseMenu();
                handleDeleteConfirmation(userId, name);
              }}
              icon="eva:trash-2-fill"
            />
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  );
}

UserTableRow.propTypes = {
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
