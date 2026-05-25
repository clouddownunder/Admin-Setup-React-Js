/* eslint-disable */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, useTheme } from "@mui/material/styles";
import { bgGradient } from "src/theme/css";
import Logo from "src/components/logo";
import { Link } from "react-router-dom";

// SweetAlert2 imports
import { showSuccess, showError } from "src/utils/swalTheme";

export default function ForgotPasswordView() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  // const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      showError(theme, "Please enter your email");
      return;
    }

    // setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/adminForgotPassword`,
        { email },
      );

      if (res.data.status === 1) {
        showSuccess(theme, res.data.message);
        setEmail("");
        navigate("/login");
      } else {
        showError(theme, res.data.message);
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      showError(theme, err.message);
    }
    // setLoading(false);
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
            className="logo"
            sx={{
              width: "190px",
              height: "auto",
              marginBottom: "20px",
              marginTop: "10px",
            }}
          />
          <Typography variant="h4" textAlign="center">
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your registered email address and we’ll send you a reset link.
          </Typography>
        </Stack>

        <br />

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <LoadingButton
            fullWidth
            // loading={loading}
            variant="contained"
            onClick={handleForgotPassword}
          >
            Send Reset Link
          </LoadingButton>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={2}
        >
          Back To{" "}
          <Link to="/login" style={{ color: "grey" }}>
            Login
          </Link>
        </Typography>
      </Card>
    </Box>
  );
}
