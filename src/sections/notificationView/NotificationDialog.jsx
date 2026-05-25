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
  const [sendTo, setSendTo] = useState("");
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
  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          overflowX: "hidden",
        },
      }}
    >
      <DialogTitle>Send Notification</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Notification Type */}
          <FormControl
            fullWidth
            variant="outlined"
            error={!!errors.notificationType}
          >
            <InputLabel>Notification Type</InputLabel>
            <Select
              labelId="notification-type-label"
              id="notification-type"
              value={notificationType}
              label="Notification Type"
              onChange={(e) => {
                setNotificationType(e.target.value);
                setErrors({ ...errors, notificationType: "" });
              }}
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="alert">Alert</MenuItem>
              <MenuItem value="update">Update</MenuItem>
            </Select>
            <FormHelperText>{errors.notificationType || " "}</FormHelperText>
          </FormControl>

          {/* Send To */}
          <FormControl fullWidth variant="outlined" error={!!errors.sendTo}>
            <InputLabel id="send-to-label">Send To</InputLabel>
            <Select
              labelId="send-to-label"
              id="send-to"
              value={sendTo}
              label="Send To"
              onChange={(e) => {
                setSendTo(e.target.value);
                setRole("");
                setErrors({ ...errors, sendTo: "" });
                setSelectedUser(null);
              }}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="role">By Role</MenuItem>
              <MenuItem value="individual">Individual</MenuItem>
            </Select>
            <FormHelperText>{errors.sendTo || " "}</FormHelperText>
          </FormControl>

          {/* Role */}
          {sendTo === "role" && (
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={role}
                label="Role"
                onChange={(e) => {
                  setRole(e.target.value);
                  setErrors({ ...errors, role: "" });
                }}
              >
                <MenuItem value="construction_admin">
                  Construction Admin
                </MenuItem>
                <MenuItem value="truck_operator_admin">
                  Truck Operator Admin
                </MenuItem>
                <MenuItem value="job_poster">Job Poster</MenuItem>
                <MenuItem value="job_accepter">Job Accepter</MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
              </Select>
              <FormHelperText>{errors.role}</FormHelperText>
            </FormControl>
          )}

          {/* Individual */}
          {sendTo === "individual" && (
            <Autocomplete
              options={users}
              getOptionLabel={(option) =>
                option?.fullName ? `${option.fullName} (${option.email})` : ""
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
                  label="Select User"
                  error={!!errors.userId}
                  helperText={errors.userId}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              fullWidth
            />
          )}

          {/* Notification Text */}
          <Box sx={{ position: "relative" }}>
            <TextField
              label="Notification Text"
              multiline
              rows={4}
              fullWidth
              value={notificationText}
              error={!!errors.notificationText}
              inputProps={{ maxLength: MAX_CHAR }}
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
                  <InputAdornment position="end">
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
              <Box
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
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {editData ? "Update" : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
