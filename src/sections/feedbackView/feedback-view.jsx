/* eslint-disable */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import appleIcon from "../../theme/images/apple.svg";
import androidIcon from "../../theme/images/android.svg";
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
    1: { label: "iOS", icon: appleIcon },
    2: { label: "Android", icon: androidIcon },
  };
  return (
    <div className="feedback-details">
      {/* ---------------- USER PROFILE SECTION ---------------- */}
      <div className="feedback-user-card">
        <div className="d-flex align-items-center">
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
            <div className="fb-name-role mb-1">
              <h6 className="mb-0 h5">
                {user.firstName} {user.lastName}
              </h6>
              <span className="badge badge-light-primary">
                {roleMap[user.role]}
              </span>
            </div>

            <p className="mb-0 fw-400 subtitle1 text_secondary">{user.email}</p>
          </div>
        </div>
      </div>

      {/* ---------------- FEEDBACK LIST SECTION ---------------- */}
      <div className="feedback-list-wrap">
        <h6 className="fb-history-title mb-sm-3">
          Feedback Submissions
          {user.feedbacks?.length > 0 && (
            <span className="badge fb-history-counter badge-light-primary">
              {user.feedbacks.length}
              {/* {user.totalFeedbacks} */}
            </span>
          )}
        </h6>

        <div className="fb-history-cardwrap">
          {user.feedbacks.map((fb) => (
            <div className="fb-history-card" key={fb.id}>
              <div className="fb-card-head">
                {/* Model Name and Icon */}
                <div className="fb-user-model-icon">
                  <span className="device-icon-wrap d-inline-block">
                    {/* {deviceTypeMap[fb.deviceInfo.deviceType]?.label || "Unknown"} */}
                    <img
                      src={deviceTypeMap[fb.deviceInfo.deviceType]?.icon}
                      alt={
                        deviceTypeMap[fb.deviceInfo.deviceType]?.label ||
                        "device"
                      }
                      width="20"
                      height="20"
                    />
                  </span>
                  <span className="subtitle1 d-block text-center">
                    {fb.deviceInfo.mobileName}
                  </span>
                </div>
                {/* Date and Time */}
                <div className="fb-card-top text_secondary d-inline-flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="15"
                    height="15"
                    viewBox="0 0 512 512"
                  >
                    <g>
                      <path
                        d="m347.216 301.211-71.387-53.54V138.609c0-10.966-8.864-19.83-19.83-19.83-10.966 0-19.83 8.864-19.83 19.83v118.978c0 6.246 2.935 12.136 7.932 15.864l79.318 59.489a19.713 19.713 0 0 0 11.878 3.966c6.048 0 11.997-2.717 15.884-7.952 6.585-8.746 4.8-21.179-3.965-27.743z"
                        fill="currentColor"
                        opacity="1"
                        data-original="currentColor"
                        class=""
                      ></path>
                      <path
                        d="M256 0C114.833 0 0 114.833 0 256s114.833 256 256 256 256-114.833 256-256S397.167 0 256 0zm0 472.341c-119.275 0-216.341-97.066-216.341-216.341S136.725 39.659 256 39.659c119.295 0 216.341 97.066 216.341 216.341S375.275 472.341 256 472.341z"
                        fill="currentColor"
                        opacity="1"
                        data-original="currentColor"
                        class=""
                      ></path>
                    </g>
                  </svg>
                  {new Date(fb.dateTime).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* <Divider sx={{ my: 2 }} /> */}

              <div className="px20 py16 pt-0">
                {/* Experience */}
                <div className="fb-field-group">
                  <div className="fb-card-top d-inline-flex mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="15"
                      height="13"
                      viewBox="0 0 682.667 682.667"
                    >
                      <g>
                        <defs>
                          <clipPath id="a" clipPathUnits="userSpaceOnUse">
                            <path
                              d="M0 512h512V0H0Z"
                              fill="#111827"
                              opacity="1"
                            />
                          </clipPath>
                        </defs>
                        <g
                          clipPath="url(#a)"
                          transform="matrix(1.33333 0 0 -1.33333 0 682.667)"
                        >
                          <path
                            d="M0 0a32.235 32.235 0 0 0 28.908 17.964A32.233 32.233 0 0 0 57.815 0c17.521-35.5 38.539-78.093 49.508-100.32a32.255 32.255 0 0 1 24.274-17.641c24.532-3.562 71.54-10.388 110.708-16.086a32.223 32.223 0 0 0 26.022-21.937 32.222 32.222 0 0 0-8.156-33.042c-28.343-27.635-62.361-60.79-80.107-78.093a32.241 32.241 0 0 1-9.276-28.529c4.191-24.435 12.226-71.25 18.915-110.265a32.23 32.23 0 0 0-12.822-31.526 32.247 32.247 0 0 0-33.953-2.458c-35.033 18.422-77.077 40.521-99.022 52.062a32.255 32.255 0 0 1-29.996 0c-21.945-11.541-63.99-33.64-99.022-52.062a32.247 32.247 0 0 0-33.953 2.458 32.233 32.233 0 0 0-12.823 31.526c6.69 39.015 14.724 85.83 18.915 110.265a32.241 32.241 0 0 1-9.276 28.529c-17.746 17.303-51.763 50.458-80.107 78.093a32.222 32.222 0 0 0-8.156 33.042 32.226 32.226 0 0 0 26.023 21.937c39.167 5.698 86.176 12.524 110.708 16.086a32.257 32.257 0 0 1 24.274 17.641C-38.539-78.093-17.521-35.5 0 0Z"
                            transform="translate(227.092 468.817)"
                            fill="none"
                            stroke="#111827"
                            strokeWidth="40"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit="10"
                            strokeDasharray="none"
                            strokeOpacity="1"
                          />
                        </g>
                      </g>
                    </svg>
                    <p className="fb-field-label mb-0">Experience</p>
                  </div>
                  <p className="fb-field-value mb-0">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since 1966, when designers at
                    Letraset and James Mosley, the librarian at St Bride
                    Printing Library, took a 1914 Cicero translation and
                    scrambled it to make dummy text for Letraset's Body Type
                    sheets.
                  </p>
                  {/* {fb.experience} */}
                </div>

                {/* Features */}
                <div className="fb-field-group">
                  <div className="fb-card-top d-inline-flex mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="15"
                      height="15"
                      viewBox="0 0 48 48"
                    >
                      <g>
                        <path
                          d="M46.216 12.186a4.002 4.002 0 0 0-4.001-4.002H17.203a4.002 4.002 0 0 0 0 8.004h25.012a4.002 4.002 0 0 0 4.001-4.002zm-2 0a2 2 0 0 1-2.001 2.001H17.203a2 2 0 0 1 0-4.002h25.012a2 2 0 0 1 2 2.001zM46.216 24.179a4.002 4.002 0 0 0-4.001-4.002H17.203a4.002 4.002 0 0 0 0 8.004h25.012a4.002 4.002 0 0 0 4.001-4.002zm-2 0a2 2 0 0 1-2.001 2H17.203a2 2 0 0 1 0-4.001h25.012a2 2 0 0 1 2 2zM46.216 36.171a4.002 4.002 0 0 0-4.001-4.002H17.203a4.002 4.002 0 0 0 0 8.004h25.012a4.002 4.002 0 0 0 4.001-4.002zm-2 0a2 2 0 0 1-2.001 2.001H17.203a2 2 0 0 1 0-4.002h25.012a2 2 0 0 1 2 2.001zM6.686 7.642a4.502 4.502 0 0 0 0 9.002 4.504 4.504 0 0 0 4.501-4.501 4.503 4.503 0 0 0-4.501-4.501zm0 2a2.502 2.502 0 1 1-.003 5.003 2.502 2.502 0 0 1 .003-5.004zM6.686 19.634a4.502 4.502 0 0 0 0 9.003 4.504 4.504 0 0 0 4.501-4.502 4.503 4.503 0 0 0-4.501-4.5zm0 2a2.502 2.502 0 1 1-.003 5.003 2.502 2.502 0 0 1 .003-5.003zM6.686 31.627a4.502 4.502 0 0 0 0 9.002 4.504 4.504 0 0 0 4.501-4.501 4.503 4.503 0 0 0-4.501-4.501zm0 2a2.502 2.502 0 1 1-.003 5.003 2.502 2.502 0 0 1 .003-5.004z"
                          fill="#111827"
                          opacity="1"
                          data-original="#111827"
                        ></path>
                      </g>
                    </svg>
                    <p className="fb-field-label mb-0">Features</p>
                  </div>
                  <p className="fb-field-value mb-0">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since 1966, when designers at
                    Letraset and James Mosley, the librarian at St Bride
                    Printing Library.
                  </p>
                  {/* {fb.features} */}
                </div>

                {/* Device Info Section */}
                <div className="fb-device-info-wrap">
                  {/* <div className="fb-card-top d-inline-flex mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="15"
                      height="15"
                      viewBox="0 0 64 64"
                    >
                      <g>
                        <path
                          d="M42 1H22a8.009 8.009 0 0 0-8 8v46a8.009 8.009 0 0 0 8 8h20a8.009 8.009 0 0 0 8-8V9a8.009 8.009 0 0 0-8-8zM16 11h32v38H16zm6-8h20a6.006 6.006 0 0 1 6 6H16a6.006 6.006 0 0 1 6-6zm20 58H22a6.006 6.006 0 0 1-6-6v-4h32v4a6.006 6.006 0 0 1-6 6z"
                          fill="currentColor"
                          opacity="1"
                          data-original="currentColor"
                        ></path>
                        <path
                          d="M32 53a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1zM35 5h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2z"
                          fill="currentColor"
                          opacity="1"
                          data-original="currentColor"
                        ></path>
                      </g>
                    </svg>
                    <p className="fb-field-label mb-0">Device Information</p>
                  </div> */}
                  <div className="fb-device-info">
                    <div className="row gx-2 gy-2">
                      {/* Device Type */}
                      <div className="col-sm-4">
                        <div className="fb-device-col">
                          <span className="caption text_secondary d-block text-center">
                            Device
                          </span>
                          <span className="caption fw-600 d-block text-center">
                            {deviceTypeMap[fb.deviceInfo.deviceType]?.label ||
                              "Unknown"}
                          </span>
                        </div>
                      </div>
                      {/* <Divider orientation="vertical" flexItem /> */}

                      {/* App Version */}
                      <div className="col-sm-4">
                        <div className="fb-device-col">
                          <span className="caption text_secondary d-block text-center">
                            App Version
                          </span>
                          <span className="caption fw-600  d-block text-center">
                            {fb.deviceInfo.versionCode}
                          </span>
                        </div>
                      </div>

                      {/* OS Version */}
                      <div className="col-sm-4">
                        <div className="fb-device-col">
                          <span className="caption text_secondary d-block text-center">
                            OS Version
                          </span>
                          <span className="caption fw-600  d-block text-center">
                            {fb.deviceInfo.osVersion}
                          </span>
                        </div>
                      </div>

                      {/* Model */}
                      {/* <div className="col-lg-3">
                        <div className="fb-device-col">
                          <span className="caption text_secondary d-block text-center">
                            Model
                          </span>
                          <span className="caption fw-600  d-block text-center">
                            {fb.deviceInfo.mobileName}
                          </span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
        </div>
      </div>
    </div>
  );
}
