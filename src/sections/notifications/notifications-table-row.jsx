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
// import { FAQSView } from "../notificationView";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";

import FaqAddEditDialog from "../notificationView/NotificationDialog";
export default function FaqTableRow({
  selected,
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
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFaqData, setEditFaqData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [open, setOpen] = useState(null);
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);

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
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={fullName}
              src={`${import.meta.env.VITE_IMAGE_URL}${avatarUrl}`}
            />
            <Typography variant="subtitle2" noWrap>
              {fullName || "N/A"}
            </Typography>
          </Stack>
        </TableCell>
        {/* <TableCell>{question || "N/A"}</TableCell> */}
        {/* <TableCell sx={{ maxWidth: 250 }}>{fullName}</TableCell> */}
        {/*wrap this text as it will be till letters and if more than letters then show it below*/}
        <TableCell>
          {capitalizeFirstLetter(notificationType)}
        </TableCell>
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
      </TableRow>

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
  block: PropTypes.bool,
};
