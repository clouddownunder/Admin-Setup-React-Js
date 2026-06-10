/* eslint-disable */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCookie, deleteCookie } from "../../../utils/format-user";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
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
    document.body.classList.add("remove-scroll");
  };
  const handleConfirmLogout = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASEURL}/auth/adminLogout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
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

      customClass: {
        container: "logout-swal-container", // parent wrapper
        popup: "logout-swal-popup", // main modal
        title: "logout-swal-title",
        htmlContainer: "logout-swal-text",
        icon: "logout-swal-icon",
        confirmButton: "logout-swal-confirm btn btn-primary",
        cancelButton: "logout-swal-cancel btn btn-lighter-grey",
      },
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
    document.body.classList.remove("remove-scroll");
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
      {/* <Dialog open={openLogoutDialog} onClose={handleCancelLogout}>
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
      </Dialog> */}
      <div
        onClick={handleOpen}
        className={`profile-avtar-btn d-flex align-items-center ${
          open ? "active" : ""
        }`}
      >
        <Avatar
          className={`profile-avtar-img ${open ? "active" : ""}`}
          src={
            userData.profilePicture
              ? `${import.meta.env.VITE_IMAGE_URL}${userData.profilePicture}`
              : ""
          }
          alt={userData.name}
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>

        <h4 className="profile-user-name mb-0 ellipsis-1">
          {userData.fullName}
        </h4>
      </div>

      <Popover
        className="profile-modal-main"
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          className: "h-profile-dropdown",
        }}
      >
        {/* <div className="h-profile-header">
          <h4 className="profile-user-name mb-0 ellipsis-1">
            {userData.fullName}
          </h4>
          <p className="profile-user-email mb-0">{userData.email}</p>
        </div> */}

        <div className="h-profile-menu-item">
          {MENU_OPTIONS.map((option) => (
            <a
              key={option.label}
              className="profile-dropdown-item"
              onClick={() => handleMenuClick(option.label)}
            >
              <span className="icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 9C9.69223 9 10.3689 8.79473 10.9445 8.41015C11.5201 8.02556 11.9687 7.47894 12.2336 6.83939C12.4985 6.19985 12.5678 5.49612 12.4327 4.81719C12.2977 4.13825 11.9644 3.51461 11.4749 3.02513C10.9854 2.53564 10.3618 2.2023 9.68282 2.06725C9.00388 1.9322 8.30015 2.00152 7.66061 2.26642C7.02107 2.53133 6.47444 2.97993 6.08986 3.55551C5.70527 4.13108 5.5 4.80777 5.5 5.5C5.50093 6.42798 5.86997 7.31768 6.52615 7.97385C7.18233 8.63003 8.07203 8.99908 9 9ZM9 3.16667C9.46149 3.16667 9.91262 3.30352 10.2963 3.55991C10.68 3.8163 10.9791 4.18071 11.1557 4.60707C11.3323 5.03343 11.3785 5.50259 11.2885 5.95521C11.1985 6.40784 10.9762 6.8236 10.6499 7.14992C10.3236 7.47624 9.90783 7.69847 9.45521 7.7885C9.00259 7.87853 8.53343 7.83233 8.10707 7.65572C7.68071 7.47912 7.31629 7.18005 7.0599 6.79633C6.80351 6.41262 6.66667 5.96149 6.66667 5.5C6.66667 4.88116 6.9125 4.28767 7.35008 3.85009C7.78767 3.4125 8.38116 3.16667 9 3.16667Z"
                    fill="#111827"
                  ></path>
                  <path
                    d="M9 10.1665C7.60809 10.168 6.27363 10.7217 5.28939 11.7059C4.30516 12.6901 3.75154 14.0246 3.75 15.4165C3.75 15.5712 3.81146 15.7196 3.92085 15.829C4.03025 15.9384 4.17862 15.9998 4.33333 15.9998C4.48804 15.9998 4.63642 15.9384 4.74581 15.829C4.85521 15.7196 4.91667 15.5712 4.91667 15.4165C4.91667 14.3335 5.34687 13.2949 6.11265 12.5292C6.87842 11.7634 7.91703 11.3332 9 11.3332C10.083 11.3332 11.1216 11.7634 11.8874 12.5292C12.6531 13.2949 13.0833 14.3335 13.0833 15.4165C13.0833 15.5712 13.1448 15.7196 13.2542 15.829C13.3636 15.9384 13.512 15.9998 13.6667 15.9998C13.8214 15.9998 13.9697 15.9384 14.0791 15.829C14.1885 15.7196 14.25 15.5712 14.25 15.4165C14.2485 14.0246 13.6948 12.6901 12.7106 11.7059C11.7264 10.7217 10.3919 10.168 9 10.1665Z"
                    fill="#111827"
                  ></path>
                </svg>
              </span>
              {option.label}
            </a>
          ))}
        </div>
        <div className="h-profile-menu-item">
          <a
            className="profile-dropdown-item logout-item"
            onClick={handleLogout}
          >
            <span className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75096 14.0625H4.16853C4.0416 14.0622 3.93877 13.9594 3.93848 13.8324V4.16755C3.93879 4.04062 4.0416 3.93779 4.16853 3.9375H6.75096C7.21695 3.9375 7.59471 3.55974 7.59471 3.09375C7.59471 2.62776 7.21695 2.25 6.75096 2.25H4.16853C3.10999 2.25124 2.25222 3.10904 2.25098 4.16755V13.8324C2.25222 14.891 3.10999 15.7488 4.16853 15.75H6.75096C7.21695 15.75 7.59471 15.3722 7.59471 14.9062C7.59471 14.4403 7.21695 14.0625 6.75096 14.0625Z"
                  fill="#D74315"
                ></path>
                <path
                  d="M15.058 7.72381L12.987 6.17179C12.6744 5.93745 12.1677 5.93754 11.8552 6.172C11.5428 6.40646 11.5429 6.78649 11.8555 7.02083L13.6757 8.3856L6.42522 8.3968C5.98327 8.3968 5.625 8.6655 5.625 8.99696C5.625 9.32842 5.98327 9.59713 6.42522 9.59713L13.7051 9.58713L11.8555 10.9743C11.5544 11.2169 11.5725 11.5967 11.8959 11.8225C12.2034 12.0372 12.6798 12.037 12.987 11.8221L15.0564 10.2701C15.9939 9.56699 15.9939 8.42698 15.0564 7.72385L15.0564 7.72383L15.058 7.72381Z"
                  fill="#D74315"
                ></path>
              </svg>
            </span>
            Logout
          </a>
        </div>
      </Popover>
    </>
  );
}
