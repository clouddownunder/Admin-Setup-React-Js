/* eslint-disable */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
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
// import { FAQSView } from "../notificationView";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";

import FaqAddEditDialog from "../notificationView/NotificationDialog";
import { fDate } from "../../utils/format-time";

export default function FaqTableRow({
  selected,
  name,
  notificationType,
  text,
  onUserDeleted,
  fullName,
  addedOn,
  avatarUrl,
  userId,
  suspended,
  block,
  key,
  isChecked,
  onCheckboxChange,
  date,
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFaqData, setEditFaqData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [open, setOpen] = useState(null);
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);
  // ViewRecipients Modal
  const [viewRecipientsOpen, setViewRecipientsOpen] = useState(false);

  const isDark = mode === "dark";
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [deleteUserId, setDeleteUserId] = useState(null);
  // const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  // const [suspendReason, setSuspendReason] = useState("");
  // const [suspendUserId, setSuspendUserId] = useState(null);
  // const [isChecked, setIsChecked] = useState(suspended);
  // const [blockChecked, setBlockChecked] = useState(block);
  // const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  // const [blockUserId, setBlockUserId] = useState(null);
  // const [blockReason, setBlockReason] = useState("");

  // useEffect(() => {
  //   setIsChecked(suspended);
  //   setBlockChecked(block);
  // }, [suspended, block]);

  const token = localStorage.getItem("token");
  const swalTheme = {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    confirmButtonColor: theme.palette.primary.main,
    cancelButtonColor: theme.palette.grey[500],
  };
  const handleDeleteFaq = async (faqId) => {
    const result = await Swal.fire({
      title: "Delete FAQ?",
      text: "This FAQ will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete",
      ...swalTheme,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASEURL}/cms/faqs/${faqId}`,
        {
          headers: { Authorization: `${token}` },
        },
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: res.data.message,
        ...swalTheme,
      });

      if (res.data.status === 1) {
        onUserDeleted?.();
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || error.message,
        confirmButtonColor: theme.palette.error.main,
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      });
    }
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

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
  //       `${import.meta.env.VITE_API_BASEURL}/admin/user/blockClients`,
  //       {
  //         userId: blockUserId,
  //         action,
  //         blockReason: action === "block" ? blockReason : "",
  //       },
  //       { headers: { Authorization: `${token}` } }
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

  // const formatMobileNumber = (code, number) => {
  //   if (!number) return code;
  //   const digits = number.replace(/\D/g, "");
  //   const formatted = digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  //   return `${code} ${formatted}`;
  // };
  const capitalizeFirstLetter = (str) => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
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

  const handleViewRecipients = () => {
    setViewRecipientsOpen(true);
  };

  const handleCloseRecipients = () => {
    setViewRecipientsOpen(false);
  };

  return (
    <>
      <FaqAddEditDialog
        open={editDialogOpen}
        editData={editFaqData}
        onClose={() => {
          setEditDialogOpen(false);
          setEditFaqData(null);
        }}
        onSuccess={() => {
          onUserDeleted?.(); // refresh FAQ list
        }}
      />

      {/* Table Row */}
      <TableRow
        key={key}
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        {/* Checkbox Column */}
        <TableCell padding="checkbox" className="checkbox-col">
          <input
            type="checkbox"
            className="form-check-input ms-2 me-3"
            checked={isChecked}
            onChange={(e) => onCheckboxChange(e.target.checked)}
          />
        </TableCell>

        <TableCell>{capitalizeFirstLetter(notificationType)}</TableCell>

        <TableCell>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {text}
          </Typography>
        </TableCell>

        <TableCell className="select-user-col">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={fullName}
              src={`${import.meta.env.VITE_IMAGE_URL}${avatarUrl}`}
            />
            <Typography variant="subtitle2" noWrap>
              {fullName || "N/A"}
              <span className="view-recipients-wrapper">
                (
                <i
                  className="fa fa-eye view-recipients"
                  title="View Recipients"
                  onClick={handleViewRecipients}
                ></i>
                )
              </span>
            </Typography>
          </Stack>
        </TableCell>

        {/* <TableCell>{fDate(date)}</TableCell> */}

        <TableCell>{fDate(date)}</TableCell>

        <TableCell align="left">
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

      {/* view-recipients Dailog open */}
      <Dialog
        open={viewRecipientsOpen}
        onClick={handleCloseRecipients}
        className="custom-modal view-recipients-modal modal-dialog modal-dialog-slideout modal-dialog-scrollable"
        data-bs-backdrop="static"
      >
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h3 className="mb-0 modal-title">Selected Users</h3>

            <button
              type="button"
              className="btn-close in-close"
              onClick={handleCloseRecipients}
            />
          </div>

          {/* Main content */}
          <div className="modal-body" dividers>
            <div className="parent-table">
              <TableContainer className="table">
                <Table>
                  <TableHead>
                    <TableRow hover>
                      <TableCell className="checkbox-col">#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow hover>
                      <TableCell>1</TableCell>

                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            alt={fullName}
                            src={`${
                              import.meta.env.VITE_IMAGE_URL
                            }${avatarUrl}`}
                          />
                          <Typography variant="subtitle2" noWrap>
                            {/* {fullName || "N/A"} */}
                            John Doe
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>john@example.com</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div
              id="recipients-total-container"
              class="text-muted total-recipients"
            >
              <div class="recipients-svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="18"
                  height="18"
                  viewBox="0 0 32 32"
                >
                  <g>
                    <path
                      d="M11.429 16a5.715 5.715 0 1 0-5.715-5.714A5.72 5.72 0 0 0 11.429 16zM18.905 20.721A10.434 10.434 0 0 0 1 28a1 1 0 0 0 1 1h18.86a1 1 0 0 0 1-1 10.067 10.067 0 0 0-.485-3.124 10.36 10.36 0 0 0-2.47-4.155z"
                      fill="var(--primary-main)"
                    ></path>
                    <circle
                      cx="23.5"
                      cy="12.25"
                      r="4.25"
                      fill="var(--primary-main)"
                    ></circle>
                    <path
                      d="M23.5 17.67a7.482 7.482 0 0 0-3.806 1.057c.217.194.436.385.641.595a12.388 12.388 0 0 1 2.952 4.966 11.488 11.488 0 0 1 .437 1.882H30a1 1 0 0 0 1-1 7.508 7.508 0 0 0-7.5-7.5z"
                      fill="var(--primary-main)"
                    ></path>
                  </g>
                </svg>
              </div>
              <span class="fw-medium">
                Total Recipients:{" "}
                <span
                  id="total-recipients-count"
                  class="text_primary fw-medium ms-1"
                >
                  1
                </span>
              </span>
            </div>
          </div>
        </div>
      </Dialog>

      {/* end */}

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 140 } }}
      ></Popover>
    </>
  );
}

FaqTableRow.propTypes = {
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
  onCheckboxChange: PropTypes.func,
  isChecked: PropTypes.bool,
  block: PropTypes.bool,
};
