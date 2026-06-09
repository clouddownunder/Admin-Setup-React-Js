/* eslint-disable */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
  Button,
  Grid,
  Box,
  useTheme,
  Skeleton,
  Chip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function FeedbackView({ userId, onClose }) {
  const theme = useTheme();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const [showFullFeedback, setShowFullFeedback] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_BASEURL}/auth/getFeedbackById/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        if (res.data.status === 1) {
          setUser(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, [userId, token]);

  if (!user) {
    return (
      <div>
        <div>
          {/* Avatar column */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Skeleton
              animation="wave"
              variant="circular"
              width={120}
              height={120}
            />
          </Grid>

          {/* Middle column */}
          <Grid item xs={12} md={4}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} mb={2}>
                <Skeleton
                  animation="wave"
                  variant="text"
                  width={100}
                  height={20}
                />
                <Skeleton
                  animation="wave"
                  variant="text"
                  height={28}
                  width="80%"
                />
              </Box>
            ))}
          </Grid>

          {/* Right column (feedback + status) */}
          <Grid item xs={12} md={4}>
            {/* Feedback title */}
            <Skeleton animation="wave" variant="text" width={120} height={20} />

            {/* Feedback content */}
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                animation="wave"
                variant="text"
                height={22}
                width="100%"
              />
            ))}

            {/* Read more button placeholder */}
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={80}
              height={24}
              sx={{ mt: 1 }}
            />

            {/* Status */}
            <Box mt={3}>
              <Skeleton
                animation="wave"
                variant="text"
                width={80}
                height={20}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width={100}
                height={28}
              />
            </Box>
          </Grid>
        </div>
      </div>
    );
  }

  const formatMobile = (number) => {
    if (!number) return "N/A";
    const digits = number.replace(/\D/g, "");
    return digits.replace(/(\d{3})(\d{3})(\d{3,})/, "$1 $2 $3");
  };
  const roleMap = {
    job_poster: "Job Poster",
    job_accepter: "Job Acceptor",
    driver: "Driver",
  };

  const deviceTypeMap = {
    1: { label: "iOS", color: "primary" },
    2: { label: "Android", color: "success" },
  };
  return (
    <div className="feedback-details">
      {/* ---------------- USER PROFILE SECTION ---------------- */}
      <div className="feedback-user-card">
        <div className="d-flex">
          <Avatar
            className="feedback-user-avtar"
            src={
              `${import.meta.env.VITE_IMAGE_URL}${user.profilePicture}` || ""
            }
            sx={{ width: 100, height: 100, margin: "auto" }}
          >
            {user.firstName?.[0]}
          </Avatar>

          <div className="fb-user-info">
            <h6 className="mb-2">
              {user.firstName} {user.lastName}
            </h6>
            <p className="mb-2 fw-400 text_secondary">{user.email}</p>

            <span className="badge primary-badge">{roleMap[user.role]}</span>
          </div>
        </div>

        <div className="feedback-count">
          <h6 className="mb-2">{user.totalFeedbacks}</h6>
          <p className="text_secondary mb-0 fw-400">Total Feedbacks</p>
        </div>
      </div>

      {/* ---------------- FEEDBACK LIST SECTION ---------------- */}
      <div className="feedback-list-wrap">
        <h6 className="fb-history-title">User Feedback History
          <span className="badge"></span>
        </h6>

        <Stack spacing={3}>
          {user.feedbacks.map((fb) => (
            <Card key={fb.id} elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                {/* Date */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" color="text.secondary">
                    {new Date(fb.dateTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>

                  <Chip
                    label={
                      deviceTypeMap[fb.deviceInfo.deviceType]?.label ||
                      "Unknown"
                    }
                    color={
                      deviceTypeMap[fb.deviceInfo.deviceType]?.color ||
                      "default"
                    }
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Experience */}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Experience
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, mb: 2 }}>
                  {fb.experience}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Features */}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Features
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, mb: 2 }}>
                  {fb.features}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Device Info Section */}
                {/* Device Info Section */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      display: "block",
                      mb: 1.5,
                    }}
                  >
                    Device Information
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      backgroundColor: "background.default",
                    }}
                  >
                    {/* Device Type */}
                    <Box textAlign="center" flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        Device
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {deviceTypeMap[fb.deviceInfo.deviceType]?.label ||
                          "Unknown"}
                      </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    {/* App Version */}
                    <Box textAlign="center" flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        App Version
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {fb.deviceInfo.versionCode}
                      </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    {/* OS Version */}
                    <Box textAlign="center" flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        OS Version
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {fb.deviceInfo.osVersion}
                      </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    {/* Model */}
                    <Box textAlign="center" flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        Model
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ wordBreak: "break-word" }}
                      >
                        {fb.deviceInfo.mobileName}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            // <Card key={fb.id} elevation={1} sx={{ borderRadius: 3 }}>
            //   <CardContent>
            //     {/* Date */}
            //     <Typography
            //       variant="caption"
            //       color="text.secondary"
            //       display="block"
            //       mb={1}
            //     >
            //       {new Date(fb.dateTime).toLocaleString("en-GB", {
            //         day: "2-digit",
            //         month: "short",
            //         year: "numeric",
            //         hour: "2-digit",
            //         minute: "2-digit",
            //       })}
            //     </Typography>

            //     <Divider sx={{ mb: 2 }} />

            //     {/* Experience */}
            //     <Typography variant="subtitle2">Experience</Typography>
            //     <Typography variant="body2" sx={{ mb: 2 }}>
            //       {fb.experience}
            //     </Typography>

            //     {/* Features */}
            //     <Typography variant="subtitle2">Features</Typography>
            //     <Typography variant="body2" sx={{ mb: 2 }}>
            //       {fb.features}
            //     </Typography>

            //     {/* Device Info */}
            //     <Box
            //       sx={{
            //         backgroundColor: "#f9f9f9",
            //         p: 2,
            //         borderRadius: 2,
            //         mt: 2,
            //       }}
            //     >
            //       <Typography variant="subtitle2" gutterBottom>
            //         Device Information
            //       </Typography>

            //       <Grid container spacing={1}>
            //         <Grid item xs={6}>
            //           <Typography variant="caption">
            //             Device Type: {fb.deviceInfo.deviceType}
            //           </Typography>
            //         </Grid>
            //         <Grid item xs={6}>
            //           <Typography variant="caption">
            //             Version: {fb.deviceInfo.versionCode}
            //           </Typography>
            //         </Grid>
            //         <Grid item xs={6}>
            //           <Typography variant="caption">
            //             OS: {fb.deviceInfo.osVersion}
            //           </Typography>
            //         </Grid>
            //         <Grid item xs={6}>
            //           <Typography variant="caption">
            //             Model: {fb.deviceInfo.mobileName}
            //           </Typography>
            //         </Grid>
            //       </Grid>
            //     </Box>
            //   </CardContent>
            // </Card>
          ))}
        </Stack>
      </div>
    </div>
  );
}
