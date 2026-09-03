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
import { Chip } from "@mui/material";
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
  const [sendTo, setSendTo] = useState("");
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [users, setUsers] = useState([]);
  const [notificationType, setNotificationType] = useState("general");
  const [imgError, setImgError] = useState(false);
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
          setUsers(res.data?.data?.data || []);
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
    setSelectedUser([]);
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

    if (sendTo === "individual" && selectedUser?.length === 0) {
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
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/pushNotification`,
        {
          notificationType,
          text: notificationText,
          sendTo,
          role: sendTo === "role" ? role : undefined,
          userIds:
            sendTo === "individual"
              ? selectedUser.map((item) => item._id)
              : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.status === 1) {
        showSuccessPopup(res.data.message.message);
        onSuccess?.();
        resetForm();
        onClose();
      } else {
        showErrorPopup(res.data.message);
      }
    } catch (err) {
      showErrorPopup(err?.response?.data?.message || err.message);
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
      className="custom-modal-main"
      open={open}
      fullWidth
      maxWidth='sm'
      onClose={() => {
        resetForm();
        onClose();
      }}
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
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
                // IconComponent={CustomRedArrowIcon}
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
            {errors.notificationType && (
              <>
                <FormHelperText className="error-mesg">
                  {errors.notificationType || " "}
                </FormHelperText>
              </>
            )}
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
                displayEmpty
                onChange={(e) => {
                  setSendTo(e.target.value);
                  setRole("");
                  setErrors({ ...errors, sendTo: "" });
                  setSelectedUser([]);
                }}
                // IconComponent={CustomRedArrowIcon}
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
                <MenuItem value="" disabled className="notification-menu-item">
                  Select Recipient
                </MenuItem>
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
            {errors.sendTo && (
              <>
                <FormHelperText className="error-mesg">
                  {errors.sendTo || " "}
                </FormHelperText>
              </>
            )}
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
                  labelId="role-label"
                  id="role-label"
                  value={role}
                  displayEmpty
                  onChange={(e) => {
                    setRole(e.target.value);
                    setErrors({ ...errors, role: "" });
                  }}
                  // IconComponent={CustomRedArrowIcon}
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
                  <MenuItem value="" disabled className="notification-menu-item">
                    Select Role
                  </MenuItem>
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
              {errors.role && (
                <>
                  <FormHelperText className="error-mesg">
                    {errors.role}
                  </FormHelperText>
                </>
              )}
            </FormControl>
          )}

          {/* Individual */}
          {sendTo === "individual" && (
            <FormControl fullWidth className="field-group">
              <div className="input-field individual">
                <label htmlFor="select-user" className="main-label mb-1">
                  Select User
                </label>
                <div className="autocomplete-input position-relative">
                  <Autocomplete
                    multiple
                    options={Array.isArray(users) ? users : []}
                    // open={sendTo === "individual"} // For temp
                    // disableCloseOnSelect
                    ListboxProps={{
                      className: "custom-user-listbox",
                    }}
                    limitTags={3}
                    className="more-tag"
                    getOptionLabel={(option) => option?.fullName ?? ""}
                    value={selectedUser}
                    onChange={(event, newValue) => {
                      setSelectedUser(newValue);
                      setErrors({ ...errors, userId: "" });
                    }}
                    // For custom classname add in tags
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          label={option.fullName}
                          className="custom-user-tag"
                        />
                      ))
                    }
                    // end
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    renderOption={(props, option) => {
                      const initials =
                        option.fullName
                          ?.split(" ")
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase() ?? "?";
                      return (
                        <li {...props} key={option._id}>
                          <Box
                            className="n-user-img-box"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            {option.profileImage && !imgError ? (
                              <img
                                className="n-user-img"
                                src={
                                  option.profileImage
                                    ? `${import.meta.env
                                      .VITE_IMAGE_NOTIFICATION_URL
                                    }${option.profileImage}`
                                    : ""
                                }
                                onError={() => setImgError(true)}
                                alt={option.fullName}
                              />
                            ) : (

                              <Box className="n-user-img">{initials}</Box>
                            )}
                            <Box>
                              <Box className="n-user-name">
                                {option.fullName}
                              </Box>
                              <Box className="n-user-email">{option.email}</Box>
                            </Box>
                          </Box>
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          className="form-control border"
                          error={!!errors.userId}
                          placeholder={selectedUser?.length > 0 ? "" : "Select User"}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              padding: "0px 10px",
                            },

                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },

                            "& .MuiInputBase-input": {
                              padding: "10px 0px",
                            },
                          }}
                        />

                        {errors.userId && (
                          <div className="Mui-error error-mesg">
                            {errors.userId}
                          </div>
                        )}
                      </>
                    )}
                    fullWidth
                  />
                </div>
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
                  <div className="emoji-picker-wrapper">
                    <EmojiPicker
                      className="emojipicker-main"
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
          className={`btn btn-primary ms-2 ${loading ? "btn-loading" : ""}`}
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
