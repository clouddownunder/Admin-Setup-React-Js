/* eslint-disable */
import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, useTheme } from "@mui/material/styles";

import { bgGradient } from "src/theme/css";
import Logo from "src/components/logo";

// SweetAlert
import { showSuccess, showError } from "src/utils/swalTheme";

// Icons
import Iconify from "src/components/iconify";

export default function ResetPasswordView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <Box textAlign="center" mt={5}>
        Invalid or expired link
      </Box>
    );
  }

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      return showError(theme, "All fields are required");
    }

    if (password.length < 6) {
      return showError(theme, "Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return showError(theme, "Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/adminResetPassword`,
        {
          token,
          newPassword: password,
        },
      );

      if (res.data.status === 1) {
        await showSuccess(theme, "Password changed successfully");

        navigate("/login");
      } else {
        showError(theme, res.data.message);
      }
    } catch (err) {
      console.error(err);
      showError(theme, err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: "/assets/background/overlay_4.jpg",
        }),
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ p: 5, width: 1, maxWidth: 420 }}>
        <Stack spacing={2} alignItems="center">
          <Logo
            sx={{
              width: "190px",
              height: "auto",
              marginBottom: "20px",
              marginTop: "10px",
            }}
          />

          <Typography variant="h4" textAlign="center">
            Reset Password
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Enter your new password below.
          </Typography>
        </Stack>

        <br />

        <Stack spacing={3}>
          {/* New Password */}
          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                    <Iconify
                      icon={showConfirm ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            loading={loading}
            variant="contained"
            onClick={handleResetPassword}
          >
            Change Password
          </LoadingButton>
        </Stack>
      </Card>
    </Box>
  );
}
