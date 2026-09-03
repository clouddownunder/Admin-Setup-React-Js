/* eslint-disable */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// import LoadingButton from "@mui/lab/LoadingButton";
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
  const [errors, setErrors] = useState({
    email: "",
  });
  const handleForgotPassword = async () => {
    const newErrors = {
      email: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (newErrors.email) {
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/adminForgotPassword`,
        { email }
      );

      if (res.data.status === 1) {
        showSuccess(theme, res.data.message);
        setEmail("");
      } else {
        // backend error only
        showError(theme, res.data.message);
      }

    } catch (err) {
      // backend error only
      showError(
        theme,
        err?.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="parentform">
      <Box
        className="login-container"
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.9),
            imgUrl: "/assets/background/overlay_4.jpg",
          }),
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo outside and above the card */}
        <Logo
          className="logo"
          sx={{
            width: "210px",
            height: "auto",
            marginBottom: "20px",
            marginTop: "10px",
          }}
        />
        <Card className="login-cardm1">
          <div className="mb-3">
            <h2 className="fw-bold h4 mb-2">Forgot Password</h2>
            <p className="text-muted subtitle1 mb-0">
              {" "}
              Enter your registered email address and we’ll send you a reset
              link.{" "}
            </p>
          </div>

          <Stack>
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              Email Address*
            </Typography>
            <TextField
              fullWidth
              placeholder="Email Address"
              name="email"
              value={email}
              error={!!errors.email}
              helperText={errors.email}
              onChange={(e) => {
                setEmail(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }} className="input-field mb-4"
              InputProps={{
                inputProps: {
                  className: "form-control border",
                },
              }}
            />

            <button
              type="submit"
              className="login-btn btn btn-primary w-100"
              onClick={handleForgotPassword}
            >
              Send Reset Link
            </button>
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mt={2}
            className="backtologin-text"
          >
            Back To{" "}
            <Link to="/login" className="re-login-link">
              Login
            </Link>
          </Typography>
        </Card>
      </Box>
    </div>
  );
}
