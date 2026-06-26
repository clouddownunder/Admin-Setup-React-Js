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
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
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
  const [sendTo, setSendTo] = useState("all");
  const [role, setRole] = useState("construction_admin");
  const [selectedUser, setSelectedUser] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [users, setUsers] = useState([]);
  const [notificationType, setNotificationType] = useState("general");
  const [imgError, setImgError] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendResult, setSendResult] = useState({
    success: 0,
    failed: 0,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    setSendTo("all");
    setRole("construction_admin");
    setNotificationType("general");
    setErrors({});
    setSelectedUser([]);
  };
  useEffect(() => {
    if (open) {
      setErrors({});
      setIsSubmitted(false); // ✅ add this
      setShowSuccessModal(false); // ✅ add this
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
        setSendResult({
          success: res.data?.message?.successCount || 0, // ✅ was res.data?.message?.success
          failed: res.data?.message?.failureCount || 0, // ✅ was res.data?.message?.failed
        });

        resetForm();
        setIsSubmitted(true); // ✅ hides first dialog locally
        setShowSuccessModal(true); // ✅ shows success dialog immediately
        onSuccess?.();
        // ❌ Don't call onClose() here
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
    <>
      <Dialog
        className="custom-modal notification-modal modal-dialog modal-dialog-slideout modal-dialog-scrollable"
        open={open && !isSubmitted}
        disableEscapeKeyDown
        onClose={() => {
          resetForm();
          onClose();
        }}
        PaperProps={{}}
      >
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h3 className="mb-0 modal-title">Send Notification</h3>
            <button
              onClick={() => {
                resetForm();
                setIsSubmitted(false);
                onClose();
              }}
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
                  <label
                    htmlFor="notification-type"
                    className="main-label mb-1"
                  >
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
                    <MenuItem
                      value="general"
                      className="notification-menu-item"
                    >
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
                    onChange={(e) => {
                      setSendTo(e.target.value);
                      setRole("construction_admin");
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
                    <MenuItem value="all" className="notification-menu-item">
                      All Users
                    </MenuItem>
                    <MenuItem value="role" className="notification-menu-item">
                      By Role
                    </MenuItem>
                    <MenuItem
                      value="individual"
                      className="notification-menu-item"
                    >
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
                      <MenuItem
                        value="driver"
                        className="notification-menu-item"
                      >
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
                                        ? `${
                                            import.meta.env
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
                                  <Box className="n-user-email">
                                    {option.email}
                                  </Box>
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
                              placeholder={
                                selectedUser?.length > 0 ? "" : "Select User"
                              }
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
                              notificationText.length +
                                emojiData.emoji.length <=
                              MAX_CHAR
                            ) {
                              setNotificationText(
                                (prev) => prev + emojiData.emoji,
                              );
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
          <div className="modal-footer bg-white border-top">
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
        </div>
      </Dialog>

      {/* Succuessfull notification dialog  */}
      <Dialog
        open={showSuccessModal}
        className="custom-modal notification-modal"
        onClose={() => {
          setShowSuccessModal(false);
          setIsSubmitted(false);
          onClose();
        }}
        PaperProps={{}}
      >
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h3 className="mb-0 modal-title">Sending Notifications</h3>
            <button
              className="btn-close  "
              onClick={() => {
                setShowSuccessModal(false);
                setIsSubmitted(false);
                onClose();
              }}
            />
          </div>

          {/* Main content */}
          <div className="modal-body" dividers>
            <Box
              sx={{
                width: "120px",
                height: "120px",
                margin: "20px auto",
              }}
            >
              <CircularProgressbar
                value={100}
                text={`${100}%`}
                strokeWidth={8}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                  },
                  path: {
                    stroke: "#168b58",
                    strokeLinecap: "round",
                  },
                  trail: {
                    stroke: "#e8e8e8",
                  },
                  text: {
                    fill: "#168b58",
                    fontSize: "22px",
                    fontWeight: "700",
                  },
                }}
              />
            </Box>

            <h5 class="fw-bold text-center py-3">
              Notifications Sent
              <span class="text-success"> Successfully!</span>
            </h5>

            <div className="notification-result-box mt-3 mb-3">
              <div class="row g-3">
                <div class="col-6">
                  <div class="summary-box success-box text-center p-2 p-sm-3 rounded-3 border">
                    <div class="summary-count fw-bold fs-4 text-success">
                      {sendResult.success}
                    </div>
                    <div class="summary-label text-muted small">
                      Successfully Sent
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="summary-box failed-box text-center p-2 p-sm-3 rounded-3 border">
                    <div class="summary-count fw-bold fs-4 text-danger">
                      {sendResult.failed}
                    </div>
                    <div class="summary-label text-muted small">Failed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* <Box display="flex" gap={2} mt={3}>
              <Box
                flex={1}
                textAlign="center"
                border="1px solid #4caf50"
                borderRadius="10px"
                padding="15px"
              >
                <h2
                  style={{
                    margin: 0,
                    color: "#168b58",
                  }}
                >
                  {sendResult.success}
                </h2>

                <span>Successfully Sent</span>
              </Box>

              <Box
                flex={1}
                textAlign="center"
                border="1px solid #ff5252"
                borderRadius="10px"
                padding="15px"
              >
                <h2
                  style={{
                    margin: 0,
                    color: "#e53935",
                  }}
                >
                  {sendResult.failed}
                </h2>

                <span>Failed</span>
              </Box>
            </Box> */}
          </div>
        </div>
      </Dialog>
    </>
  );
}
