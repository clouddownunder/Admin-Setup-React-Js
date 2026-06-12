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
      <Container>
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
    <div className="creators-row">
      <p className="subtitle1 mb-1">Created By</p>
      {user.createdBy ? (
        <p className="text-secondary mb-1 fw-400 subtitle1">
          • {user.createdBy.fullName || "N/A"} ({user.createdBy.email || "N/A"})
        </p>
      ) : (
        <p className="text-secondary mb-1 fw-400 subtitle1">No creator info available.</p>
      )}
    </div>
  );
  return (
    <Container maxWidth="lg" className="p-0">
      <div className="parent-table p-0">
        <div className="user-details-table table data-info-sidebar">
          <table>
            <tbody>
              {/* Title Row */}
              <tr>
                <td colspan="2" class="section-title">
                  Profile Information
                </td>
              </tr>
              {/* Profile Image */}
              <tr>
                <td width="30%" className="table-label">
                  Profile Image
                </td>
                <td width="70%">
                  <Avatar
                    className="st-avtar img-fluid rounded-circle border"
                    sx={{ width: 60, height: 60, objectFit: "cover" }}
                    src={
                      user.profilePicture
                        ? `${import.meta.env.VITE_IMAGE_URL}${
                            user.profilePicture
                          }`
                        : ""
                    }
                  />
                </td>
              </tr>

              {/* Name */}
              <tr>
                <td width="30%" className="table-label">
                  Name
                </td>
                <td width="70%">
                  {!user.fullName ? "N/A" : `${user.fullName || ""}`.trim()}
                </td>
              </tr>

              {/* Email */}
              <tr>
                <td width="30%" className="table-label">
                  Email
                </td>
                <td width="70%" style={{ wordBreak: "break-word" }}>
                  {user.email || "N/A"}
                </td>
              </tr>

              {/* Mobile */}
              <tr>
                <td width="30%" className="table-label">
                  Mobile
                </td>
                <td width="70%">{formatMobileNumber(user.mobileNo)}</td>
              </tr>

              {/* Title Row */}
              <tr>
                <td colspan="2" class="section-title">
                  Account Information
                </td>
              </tr>
              {/* Registered On */}
              <tr>
                <td width="30%" className="table-label">
                  Registered On
                </td>
                <td width="70%">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
              </tr>

              {/* Business Registration No */}
              <tr>
                <td width="30%" className="table-label">
                  Business Registration No.
                </td>
                <td width="70%">
                  {user.bussinessRegistrationNo
                    ? formatABN(user.bussinessRegistrationNo)
                    : "N/A"}
                </td>
              </tr>

              {/* Account Status */}
              <tr>
                <td width="30%" className="table-label">
                  Account Status
                </td>
                <td width="70%">
                  <span
                    className={`status-badge badge ${
                      user.isProfileSetUp === 1 ? "success-box" : "danger-box"
                    }`}
                  >
                    {user.isProfileSetUp === 1 ? "Completed" : "Incomplete"}
                  </span>
                </td>
              </tr>

              {/* Created By */}
              <tr>
                <td width="30%" className="table-label">
                  Created By
                </td>
                <td width="70%">{renderCreators()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
