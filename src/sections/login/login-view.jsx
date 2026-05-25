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
import LoadingButton from "@mui/lab/LoadingButton";
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      style={{ borderRadius: "50px" }}
    >
      <Stack spacing={3}>
        {errorMessage && (
          <Typography
            color="error"
            variant="body2"
            sx={{ textAlign: "center", fontWeight: "bolder" }}
          >
            {errorMessage}
          </Typography>
        )}

        <TextField
          name="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
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
        sx={{ my: 3 }}
      >
        <Link
          underline="hover"
          onClick={() => router.push("/forgetPassword")}
          style={{ cursor: "pointer" }}
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit" // 🔥 important
        variant="contained"
        sx={{ color: "white" }}
      >
        Login
      </LoadingButton>
    </Box>
  );

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
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 420,
        }}
      >
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
            Login
          </Typography>
        </Stack>
        <br />
        {renderForm}
      </Card>
    </Box>
  );
}
