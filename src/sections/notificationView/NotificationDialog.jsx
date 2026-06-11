/* eslint-disable */

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { showSuccess, showError } from "../../utils/swalTheme";
import { useTheme } from "@mui/material/styles";
import EmojiPicker from "emoji-picker-react";
import { Icon } from "@iconify/react";
export default function NotificationDialog({
  open,
  onClose,
  onSuccess,
  editData,
}) {
  const token = localStorage.getItem("token");
  const pickerRef = useRef(null);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [sendTo, setSendTo] = useState("all");
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [users, setUsers] = useState([]);
  const [notificationType, setNotificationType] = useState("general");

  const [errors, setErrors] = useState({});

  const showSuccessPopup = (message) => {
    showSuccess(theme, message); // ✅ PASS THEME
    onClose();
  };

  const showErrorPopup = (message) => {
    showError(theme, message); // ✅ PASS THEME
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Fetch users when individual selected
  useEffect(() => {
    if (sendTo === "individual") {
      axios
        .get(`${import.meta.env.VITE_API_BASEURL}/auth/getAllUsers`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUsers(res.data.data || []);
        })
        .catch(console.error);
    }
  }, [sendTo]);

  const resetForm = () => {
    setNotificationText("");
    setSendTo("");
    setRole("");
    setNotificationType("general");
    setErrors({});
    setSelectedUser(null);
  };
  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);
  const validate = () => {
    const newErrors = {};

    if (!notificationType) {
      newErrors.notificationType = "Notification type is required";
    }

    if (!sendTo) {
      newErrors.sendTo = "Please select recipient type";
    }

    if (sendTo === "role" && !role) {
      newErrors.role = "Role is required";
    }

    if (sendTo === "individual" && !selectedUser) {
      newErrors.userId = "User is required";
    }

    if (!notificationText.trim()) {
      newErrors.notificationText = "Notification text is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    console.log("Selected User:", selectedUser);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/pushNotification`,
        {
          notificationType,
          text: notificationText,
          sendTo,
          role: sendTo === "role" ? role : undefined,
          userId: sendTo === "individual" ? selectedUser?._id : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.status === 1) {
        showSuccessPopup(res.data.message.message);
        onSuccess?.();
        resetForm();
        onClose();
      } else {
        showErrorPopup(res.data.message.message);
      }
    } catch (err) {
      showErrorPopup(err?.response?.data?.message.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  const MAX_CHAR = 240;
  // Select dropdown arrow
  const CustomRedArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="custom-select-arrow red"
    >
      <path
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
        fill="currentColor"
      ></path>
    </svg>
  );

  return (
    <Dialog
      className="custom-modal notification-modal"
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      PaperProps={{}}
    >
      {/* Header */}
      <div className="modal-header">
        <h3 className="mb-0 modal-title">Send Notification</h3>
        <button
          onClick={() => onClose()}
          className="btn-close in-close"
        ></button>
      </div>

      {/* Main content */}
      <div className="modal-body" dividers>
        <div className="notification-form-wrap">
          {/* Notification Type */}
          <FormControl
            fullWidth
            error={!!errors.notificationType}
            className="field-group"
          >
            <div className="input-field">
              <label htmlFor="notification-type" className="main-label mb-1">
                Notification Type
              </label>
              <Select
                labelId="notification-type-label"
                id="notification-type"
                value={notificationType}
                onChange={(e) => {
                  setNotificationType(e.target.value);
                  setErrors({ ...errors, notificationType: "" });
                }}
                IconComponent={CustomRedArrowIcon}
                inputProps={{
                  className: "form-control border w-100",
                }}
                MenuProps={{
                  PaperProps: {
                    className: "notification-menu-list",
                  },
                  MenuListProps: {
                    className: "notification-menu-ul",
                  },
                }}
              >
                <MenuItem value="general" className="notification-menu-item">
                  General
                </MenuItem>
                <MenuItem value="alert" className="notification-menu-item">
                  Alert
                </MenuItem>
                <MenuItem value="update" className="notification-menu-item">
                  Update
                </MenuItem>
              </Select>
            </div>
            <FormHelperText className="error-mesg">
              {errors.notificationType || " "}
            </FormHelperText>
          </FormControl>

          {/* Send To */}
          <FormControl
            fullWidth
            error={!!errors.sendTo}
            className="field-group"
          >
            <div className="input-field">
              <label htmlFor="send-to" className="main-label mb-1">
                Send To
              </label>
              <Select
                labelId="send-to-label"
                id="send-to"
                value={sendTo}
                onChange={(e) => {
                  setSendTo(e.target.value);
                  setRole("");
                  setErrors({ ...errors, sendTo: "" });
                  setSelectedUser(null);
                }}
                IconComponent={CustomRedArrowIcon}
                inputProps={{
                  className: "form-control border w-100",
                }}
                MenuProps={{
                  PaperProps: {
                    className: "notification-menu-list",
                  },
                  MenuListProps: {
                    className: "notification-menu-ul",
                  },
                }}
              >
                <MenuItem value="all" className="notification-menu-item">
                  All Users
                </MenuItem>
                <MenuItem value="role" className="notification-menu-item">
                  By Role
                </MenuItem>
                <MenuItem value="individual" className="notification-menu-item">
                  Individual
                </MenuItem>
              </Select>
            </div>
            <FormHelperText className="error-mesg">
              {errors.sendTo || " "}
            </FormHelperText>
          </FormControl>

          {/* Role */}
          {sendTo === "role" && (
            <FormControl
              fullWidth
              error={!!errors.role}
              className="field-group"
            >
              <div className="input-field">
                <label htmlFor="role-label" className="main-label mb-1">
                  Role
                </label>
                <Select
                  style={{ marginBottom: "20px" }}
                  labelId="role-label"
                  id="role-label"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setErrors({ ...errors, role: "" });
                  }}
                  IconComponent={CustomRedArrowIcon}
                  inputProps={{
                    className: "form-control border w-100",
                  }}
                  MenuProps={{
                    PaperProps: {
                      className: "notification-menu-list",
                    },
                    MenuListProps: {
                      className: "notification-menu-ul",
                    },
                  }}
                >
                  <MenuItem
                    value="construction_admin"
                    className="notification-menu-item"
                  >
                    Construction Admin
                  </MenuItem>
                  <MenuItem
                    value="truck_operator_admin"
                    className="notification-menu-item"
                  >
                    Truck Operator Admin
                  </MenuItem>
                  <MenuItem
                    value="job_poster"
                    className="notification-menu-item"
                  >
                    Job Poster
                  </MenuItem>
                  <MenuItem
                    value="job_accepter"
                    className="notification-menu-item"
                  >
                    Job Accepter
                  </MenuItem>
                  <MenuItem value="driver" className="notification-menu-item">
                    Driver
                  </MenuItem>
                </Select>
              </div>
              <FormHelperText className="error-mesg">
                {errors.role}
              </FormHelperText>
            </FormControl>
          )}

          {/* Individual */}
          {sendTo === "individual" && (
            <FormControl fullWidth className="field-group">
              <div className="input-field individual">
                <label htmlFor="select-user" className="main-label mb-1">
                  Select User
                </label>

                <Autocomplete
                  options={users}
                  popupIcon={<CustomRedArrowIcon />}
                  forcePopupIcon={true}
                  getOptionLabel={(option) =>
                    option?.fullName
                      ? `${option.fullName} (${option.email})`
                      : ""
                  }
                  value={selectedUser}
                  onChange={(event, newValue) => {
                    setSelectedUser(newValue);
                    setErrors({ ...errors, userId: "" });
                  }}
                  renderInput={(params) => (
                    <TextField
                      style={{ marginBottom: "20px" }}
                      {...params}
                      placeholder="Select User"
                      // label="Select User"
                      error={!!errors.userId}
                      helperText={errors.userId}
                      InputProps={{
                        ...params.InputProps,
                      }}
                      inputProps={{
                        ...params.inputProps,
                        className: "form-control border",
                      }}
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  fullWidth
                />
              </div>
            </FormControl>
          )}

          {/* Notification Text */}
          <div className="textmesg-box position-relative">
            <div className="input-field">
              <label htmlFor="" className="main-label mb-1">
                Notification Text
              </label>
              <TextField
                // label="Notification Text"
                multiline
                rows={3}
                fullWidth
                placeholder="Enter notification text..."
                value={notificationText}
                error={!!errors.notificationText}
                inputProps={{
                  className: "form-control border notification-textarea",
                }}
                helperText={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{errors.notificationText || ""}</span>
                    <span>{MAX_CHAR - notificationText.length}</span>
                  </Box>
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_CHAR) {
                    setNotificationText(value);
                    setErrors({ ...errors, notificationText: "" });
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className="emojibutton">
                      <IconButton
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        edge="end"
                      >
                        <Icon icon="mdi:emoticon-outline" width={22} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {showEmojiPicker && (
                <div
                  className="emoji-box"
                  ref={pickerRef}
                  sx={{
                    position: "absolute",
                    bottom: 80,
                    right: 0,
                    zIndex: 1300,
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      if (
                        notificationText.length + emojiData.emoji.length <=
                        MAX_CHAR
                      ) {
                        setNotificationText((prev) => prev + emojiData.emoji);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-primary ms-2"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading
            ? "Sending..."
            : editData
            ? "Update Notification"
            : "Send Notification"}
        </button>
      </div>
    </Dialog>
  );
}
