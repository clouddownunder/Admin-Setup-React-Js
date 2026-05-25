/* eslint-disable */
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { deleteCookie, getCookie, setCookie } from "../../utils/format-user";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { showSuccess, showError } from "../../utils/swalTheme";
import { useTheme } from "@mui/material/styles";

export default function ProfileEditView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+61",
    mobileNo: "",
    adminProfilePic: null,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [preview, setPreview] = useState(null);
  const showSuccessPopup = (message) => {
    showSuccess(theme, message); // ✅ PASS THEME
  };

  const showErrorPopup = (message) => {
    showError(theme, message); // ✅ PASS THEME
  };
  // -------------------- Load User Data --------------------
  useEffect(() => {
    const user = getCookie("UserData");
    if (!user) return;

    const parsed = JSON.parse(decodeURIComponent(user));

    setFormData({
      fullName: parsed.fullName || "",
      email: parsed.email || "",
      countryCode: parsed.countryCode || "+61",
      mobileNo: parsed.mobileNo ? formatPhoneForDisplay(parsed.mobileNo) : "",
      adminProfilePic: null, // keep this null for new uploads
    });

    // Use the actual uploaded image from cookie
    if (parsed.profilePicture) {
      setPreview(
        `${import.meta.env.VITE_IMAGE_URL.replace(/\/$/, "")}${
          parsed.profilePicture
        }`,
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // -------------------- Helpers --------------------
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    return digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  };
  const handleCountryCodeChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("+")) value = "+" + value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, countryCode: value }));
  };
  const formatPhoneForBackend = (phone) => phone.replace(/\D/g, "");

  // -------------------- Handlers --------------------
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "adminProfilePic") {
      const file = files?.[0];
      if (!file) return;

      setFormData((prev) => ({ ...prev, adminProfilePic: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    if (name === "mobileNo") {
      setFormData((prev) => ({
        ...prev,
        mobileNo: formatPhoneForDisplay(value),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // -------------------- Submit Profile --------------------
  const handleProfileSubmit = async () => {
    try {
      if (!formData.fullName || !formData.email || !formData.mobileNo) {
        return showErrorPopup("Please fill all the fields");
      }
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("countryCode", formData.countryCode);
      form.append("mobileNo", formatPhoneForBackend(formData.mobileNo));

      if (formData.adminProfilePic) {
        form.append("adminProfilePic", formData.adminProfilePic);
      }

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/editAdmin`,
        form,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.status === 1) {
        showSuccessPopup(res.data.message);
        deleteCookie("UserData");
        setCookie("UserData", JSON.stringify(res.data.data));
        navigate("/dashboard/admin-profile");
      } else {
        showErrorPopup(res.data.message);
      }
    } catch (err) {
      showErrorPopup(err.response?.data?.message || "Something went wrong");
    }
  };

  // -------------------- Submit Password --------------------
  const handlePasswordSubmit = async () => {
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      return showErrorPopup("Please fill all the fields");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showErrorPopup("New password and confirm password do not match.");
    }

    try {
      const token = localStorage.getItem("token");
      console.log(token, "token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/changePassword`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log(res, "resposnse");
      if (res.data.status === 1) {
        showSuccessPopup(res.data.message);
        localStorage.removeItem("token");
        deleteCookie("UserData");
        navigate("/login");
      } else {
        showErrorPopup(res.data.message);
      }
    } catch (err) {
      showErrorPopup(err.response?.data?.message || "Something went wrong");
    }
  };

  const renderPasswordField = (label, name) => (
    <TextField
      fullWidth
      label={label}
      required
      name={name}
      type={showPassword[name] ? "text" : "password"}
      value={passwordData[name]}
      onChange={handlePasswordChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => handleClickShowPassword(name)}>
              <Icon
                icon={showPassword[name] ? "mdi:eye-off" : "mdi:eye"}
                fontSize={18}
                style={{ color: "black" }}
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  // -------------------- UI --------------------
  return (
    <Box p={3} maxWidth={1000} width="100%" mx="auto">
      <Button
        component={Link}
        to="/dashboard/admin-profile"
        variant="contained"
        sx={{ mb: 5 }}
      >
        Back
      </Button>

      <Grid container spacing={5}>
        {/* Edit Profile */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: "25px 20px",
              borderRadius: "15px",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" mb={3}>
              Update Admin Profile
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Full Name"
                name="fullName"
                required
                value={formData.fullName || ""}
                onChange={handleProfileChange}
              />

              <TextField
                label="Email"
                name="email"
                required
                value={formData.email || ""}
                onChange={handleProfileChange}
              />

              <Stack direction="row" spacing={2}>
                {/* Country Code */}
                <TextField
                  label="Code"
                  name="countryCode"
                  required
                  value={formData.countryCode}
                  onChange={handleCountryCodeChange}
                  sx={{ width: 100 }}
                  inputProps={{ maxLength: 4 }}
                />

                {/* Mobile Number */}
                <TextField
                  fullWidth
                  label="Mobile"
                  required
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleProfileChange}
                />
              </Stack>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={3}
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Icon icon="mdi:camera" />}
                >
                  Upload Photo
                  <input
                    type="file"
                    name="adminProfilePic"
                    accept="image/*"
                    hidden
                    onChange={handleProfileChange}
                  />
                </Button>
                <Avatar src={preview || ""} sx={{ width: 70, height: 70 }} />
              </Box>

              <Button variant="contained" onClick={handleProfileSubmit}>
                Save Profile
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: "25px 20px",
              borderRadius: "15px",
              bgcolor: "background.paper",
              height: "100%",
            }}
          >
            <Typography variant="h6" mb={3}>
              Change Password
            </Typography>

            <Stack spacing={3}>
              {renderPasswordField("Old Password", "oldPassword")}
              {renderPasswordField("New Password", "newPassword")}
              {renderPasswordField("Confirm Password", "confirmPassword")}

              <Button variant="contained" onClick={handlePasswordSubmit}>
                Change Password
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
