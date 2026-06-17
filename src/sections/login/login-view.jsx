/* eslint-disable */
import axios from "axios";
import { useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
// import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import { setCookie } from "../../utils/format-user";
import { useRouter } from "src/routes/hooks";

import { bgGradient } from "src/theme/css";

import Logo from "src/components/logo";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset previous error

    axios
      .post(`${import.meta.env.VITE_API_BASEURL}/auth/adminLogin`, {
        email,
        password,
      })
      .then((response) => {
        if (response.data.status === 1) {
          localStorage.setItem("token", response.data.data.accessToken);
          setCookie("UserData", JSON.stringify(response.data.data));
          router.push("/dashboard");
        } else {
          setErrorMessage(response.data.message || "Login failed");
        }
      })
      .catch((error) => {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        setErrorMessage(msg);
      });
  };

  const renderForm = (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack>
        {errorMessage && (
          <Typography
            color="error"
            variant="body2"
            sx={{ textAlign: "center", fontWeight: "bolder" }}
          >
            {errorMessage}
          </Typography>
        )}

        <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
          Email Address*
        </Typography>
        <TextField
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="none"
          className="input-field"
          InputProps={{
            inputProps: {
              className: "form-control border",
            },
          }}
        />

        <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
          Password*
        </Typography>
        <TextField
          name="password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
          InputProps={{
            inputProps: {
              className: "form-control border",
            },
            endAdornment: (
              <InputAdornment position="end" className="pass-eye-icon">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: "black" }}
                >
                  <Iconify
                    style={{ fontSize: "small" }}
                    icon={showPassword ? "eva:eye-off-fill" : "eva:eye-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ mt: 1, mb: 3 }}
      >
        <Link
          className="forgotpass"
          underline="hover"
          onClick={() => router.push("/forgetPassword")}
          style={{ cursor: "pointer" }}
        >
          Forgot password?
        </Link>
      </Stack>

      <button className="login-btn btn btn-primary w-100" type="submit">
        Login
      </button>
    </Box>
  );

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
            <h2 className="fw-bold h4 mb-2">Login</h2>
            <p className="text-muted subtitle1 mb-0">
              {" "}
              Please enter your detail to login in your account{" "}
            </p>
          </div>
          {renderForm}
        </Card>
      </Box>
    </div>
  );
}
