/* eslint-disable */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCookie, deleteCookie } from "../../../utils/format-user";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useTheme } from "@mui/material/styles";
import DialogActions from "@mui/material/DialogActions";
import Swal from "sweetalert2";
import { account } from "src/_mock/account";
import { useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // {
  //   label: "Home",
  //   icon: "eva:home-fill",
  // },
  {
    label: "Admin Profile",
    icon: "eva:person-fill",
  },
  // {
  //   label: "Settings",
  //   icon: "eva:settings-2-fill",
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [userData, setUserData] = useState({});
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  useEffect(() => {
    const UserData = getCookie("UserData");
    setUserData(JSON.parse(decodeURIComponent(UserData)));
  }, [navigate]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleConfirmLogout = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASEURL}/auth/adminLogout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (res?.data?.status === 1) {
      localStorage.clear();
      deleteCookie("UserData");
      navigate("/login");
    }
    setOpenLogoutDialog(false);
  };
  const handleLogout = async () => {
    handleClose();

    const result = await Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "No",

      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.grey[500],

      background: theme.palette.background.paper,
      color: theme.palette.text.primary,

      didOpen: () => {
        document.querySelector(".swal2-container").style.zIndex = 9999;
      },
    });

    if (result.isConfirmed) {
      handleConfirmLogout();
    }
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleCancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  const handleMenuClick = (label) => {
    if (label === "Admin Profile") {
      handleClose();
      navigate("/dashboard/admin-profile");
    }
  };

  return (
    <>
      <Dialog open={openLogoutDialog} onClose={handleCancelLogout}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout}>No</Button>
          <Button onClick={handleConfirmLogout} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={
            userData.profilePicture
              ? `${import.meta.env.VITE_IMAGE_URL}${userData.profilePicture}`
              : ""
          }
          alt={userData.name}
          sx={{
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
          className="profile-avtar-img"
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {userData.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {userData.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              handleMenuClick(option.label);
            }}
          >
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
