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
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { use } from "react";

export default function UserView({ userId, onClose }) {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const formatABN = (value) => {
    if (!value) return "";

    const clean = value.replace(/\D/g, "").slice(0, 11);

    if (clean.length <= 2) return clean;
    if (clean.length <= 5) return clean.replace(/(\d{2})(\d+)/, "$1 $2");
    if (clean.length <= 8)
      return clean.replace(/(\d{2})(\d{3})(\d+)/, "$1 $2 $3");

    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1 $2 $3 $4");
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASEURL}/auth/getAdminById/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={2} alignItems="flex-start">
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

          {/* Right column */}
          <Grid item xs={12} md={4}>
            {[1, 2, 3].map((i) => (
              <Box key={i} mb={2}>
                <Skeleton
                  animation="wave"
                  variant="text"
                  width={120}
                  height={20}
                />
                <Skeleton
                  animation="wave"
                  variant="text"
                  width="70%"
                  height={28}
                />
              </Box>
            ))}
          </Grid>
        </Grid>
      </Container>
    );
  }

  const formatMobileNumber = (number) => {
    if (!number) return "";

    const digits = number.replace(/\D/g, "");

    let formatted = "";

    // If 10 digits (starts with 0) → local Australian format
    if (digits.length === 10) {
      formatted = digits.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
      return formatted; // no +61
    }

    // If 9 digits → international format
    if (digits.length === 9) {
      formatted = digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
      return `+61 ${formatted}`;
    }

    return digits; // fallback
  };

  // const renderDocuments = () => {
  //   if (!user.documents) {
  //     return (
  //       <>
  //         <Typography variant="subtitle1" style={{marginTop:"10px"}} fontWeight={600}>
  //           Uploaded Documents
  //         </Typography>
  //         <Typography variant="body2" color="text.secondary">
  //           No documents uploaded.
  //         </Typography>
  //       </>
  //     );
  //   }

  //   const docs = user.documents;

  //   const imageFields = [
  //     { label: "Driver License", key: "driverLicense" },
  //     { label: "White Card", key: "whiteCard" },
  //     { label: "Verification of Competency", key: "verificationOfCompetency" },
  //     { label: "High Risk Work License", key: "highRiskWorkLicense" },
  //     { label: "Competency Certificate", key: "competencyCertificate" },
  //     { label: "VOC Chipper", key: "vocChipper" },
  //   ];

  //   return (
  //     <Box mt={3}>
  //       <Typography variant="subtitle1" fontWeight={600}>
  //         Uploaded Documents
  //       </Typography>

  //       <Grid container spacing={2} mt={1}>
  //         {imageFields.map(({ label, key }) =>
  //           docs[key] ? (
  //             <Grid item xs={12} md={4} key={key}>
  //               <Typography variant="body2" fontWeight={500}>
  //                 {label}
  //               </Typography>
  //               <img
  //                 src={`${import.meta.env.VITE_IMAGE_URL}${docs[key]}`}
  //                 alt={label}
  //                 style={{
  //                   width: "100%",
  //                   maxHeight: 150,
  //                   objectFit: "cover",
  //                   borderRadius: 8,
  //                   marginTop: 5,
  //                   cursor: "pointer",
  //                 }}
  //                 onClick={() =>
  //                   window.open(
  //                     `${import.meta.env.VITE_IMAGE_URL}${docs[key]}`,
  //                     "_blank",
  //                   )
  //                 }
  //               />
  //             </Grid>
  //           ) : null,
  //         )}
  //       </Grid>
  //     </Box>
  //   );
  // };

  const renderCreators = () => (
    <Box mt={2}>
      <Typography variant="subtitle1" fontWeight={600}>
        Created By
      </Typography>
      {user.createdBy ? (
        <Typography variant="body2">
          • {user.createdBy.fullName || "N/A"} ({user.createdBy.email || "N/A"})
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No creator info available.
        </Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent> */}
      {/* Top section: Profile summary */}
      <Grid container spacing={2} alignItems="flex-start">
        {/* Left: Profile Image and Name */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "auto",
            padding: "0px 0px 0px 0px !important",
            marginTop: isMedium ? "5%" : "auto",
          }}
        >
          {/* <Stack alignItems="center" spacing={2}> */}
          <Avatar
            sx={{ width: 120, height: 120 }}
            src={
              user.profilePicture
                ? `${import.meta.env.VITE_IMAGE_URL}${user.profilePicture}`
                : ""
            }
          />
          {/* <Typography variant="h6" textAlign="center">
                  {user.first_name || "N/A"} {user.last_name || "N/A"}
                </Typography> */}
          {/* </Stack> */}
        </Grid>

        {/* Right: Email, Mobile, Created Date */}
        <Grid item xs={12} md={4}>
          <Grid item spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Name</Typography>
              <Typography variant="body1">
                {!user.fullName ? "N/A" : `${user.fullName || ""}`.trim()}
              </Typography>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Typography variant="subtitle1">Email</Typography>
              <Typography variant="body1" style={{ wordBreak: "break-word" }}>
                {user.email || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Typography variant="subtitle1">Mobile</Typography>
              <Typography variant="body1">
                {formatMobileNumber(user.mobileNo)}
              </Typography>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Typography variant="subtitle1">Registered On</Typography>
              <Typography variant="body1">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid item>
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Business Registration No.
                </Typography>
                {user.bussinessRegistrationNo ? (
                  <Typography variant="body1">
                    {formatABN(user.bussinessRegistrationNo)}
                  </Typography>
                ) : (
                  <Typography variant="body1">N/A</Typography>
                )}
                {/* {
                  // user.suspended === true ||
                  user.isBlocked === true && (
                    <>
                      {user.suspended === true && (
                        <Box mt={2}>
                          <Typography variant="subtitle1">
                            Suspend Reason
                          </Typography>
                          <Typography variant="body1">
                            {user.suspend_reason ? user.suspend_reason : "No reason provided"}
                          </Typography>
                        </Box>
                      )}
                      {user.isBlocked === true && (
                        <Box mt={2}>
                          <Typography variant="subtitle1">
                            Block Reason
                          </Typography>
                          <Typography variant="body1">
                            {user.blockReason
                              ? user.blockReason
                              : "No Reason Provided"}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )
                } */}
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bolder", mt: 2 }}
                >
                  Account Status
                </Typography>
                <Typography variant="body1">
                  {user.isProfileSetUp === 1 ? "Completed" : "Incomplete"}
                </Typography>

                {renderCreators()}
                {/* {renderDocuments()} */}
              </Grid>
            </>
          </Grid>
        </Grid>
      </Grid>
      {/* </CardContent>
      </Card> */}
    </Container>
  );
}
