/* eslint-disable */
import { useEffect, useState } from "react";
import {
  Card,
  Container,
  Typography,
  Avatar,
  Stack,
  Box,
  Button,
  Skeleton,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/format-user"; // ✅ REQUIRED

const ProfileView = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        if (!token) {
          console.warn("Token missing");
          return;
        }

        const cookie = getCookie("UserData");
        if (!cookie) {
          console.warn("UserData cookie missing");
          return;
        }

        const user = JSON.parse(decodeURIComponent(cookie));

        console.log("Calling API with ID:", user.userId);

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASEURL}/auth/getAdminById/${
            user.userId
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ correct
            },
          },
        );

        console.log("API response:", res.data);

        if (res.data.status === 1) {
          setAdmin(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching admin:", err);
      }
    };

    fetchAdmin();
  }, [token]);

  const handleBack = () => navigate("/dashboard");
  const handleEdit = () => navigate("/dashboard/admin-profile/edit");

  if (!admin) {
    return (
      <Container maxWidth="sm">
        {/* Back button skeleton */}
        <Box sx={{ display: "flex", mt: 4 }}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={80}
            height={36}
          />
        </Box>

        {/* Title skeleton */}
        <Skeleton
          animation="wave"
          variant="text"
          height={40}
          sx={{ mt: 3, width: "60%" }}
        />

        <Card sx={{ p: 4, mt: 2 }}>
          {/* Edit button skeleton */}
          <Box sx={{ position: "absolute", top: 16, right: 16 }}>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={60}
              height={30}
            />
          </Box>

          <Stack alignItems="center" spacing={2}>
            {/* Avatar */}
            <Skeleton
              animation="wave"
              variant="circular"
              width={100}
              height={100}
            />

            {/* Name */}
            <Skeleton animation="wave" variant="text" width={180} height={30} />

            {/* Email */}
            <Skeleton animation="wave" variant="text" width={220} />

            {/* Phone */}
            <Skeleton animation="wave" variant="text" width={160} />
          </Stack>
        </Card>
      </Container>
    );
  }

  // const formatMobileNumber = (mobileNo) => {
  //   if (!mobileNo) return "";

  //   const cleaned = mobileNo.replace(/\s+/g, "").replace(/-/g, "");

  //   const match = cleaned.match(/^(\+\d{1,3})(\d{9,10})$/);

  //   if (!match) return mobileNo;

  //   const countryCode = match[1];
  //   const number = match[2];

  //   const formattedNumber = number.replace(
  //     /(\d{3})(\d{3})(\d{3,4})/,
  //     "$1 $2 $3",
  //   );

  //   return `${countryCode} ${formattedNumber}`;
  // };
  // const formatMobileNumber = (mobileNo) => {
  //   if (!mobileNo) return "";

  //   const cleaned = mobileNo.replace(/\s+/g, "");

  //   const match = cleaned.match(/^(\+\d{2})(\d{9})$/);

  //   if (!match) return mobileNo;

  //   const countryCode = match[1];
  //   const number = match[2];

  //   const formatted = number.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

  //   return `${countryCode} ${formatted}`;
  // };
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

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", mt: 4 }}>
        <Button variant="contained" onClick={handleBack}>
          Back
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom mt={3}>
        Admin Profile
      </Typography>

      <Card sx={{ p: 4, mt: 2, position: "relative" }}>
        <IconButton
          onClick={handleEdit}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <Icon icon="mdi:pencil" width={20} color="#d74315" />
        </IconButton>

        <Stack alignItems="center" spacing={2}>
          <Avatar
            src={
              admin.profilePicture
                ? `${import.meta.env.VITE_IMAGE_URL}${admin.profilePicture}`
                : ""
            }
            alt={admin.name}
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h5">{admin.fullName}</Typography>
          <Typography>{admin.email}</Typography>
          <Typography color="text.secondary">
            +61 {formatPhoneForDisplay(admin.mobileNo)}
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
};

export default ProfileView;
