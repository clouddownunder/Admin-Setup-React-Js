// FeedbackView.jsx — full replacement

/* eslint-disable */
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import appleIcon from "../../theme/images/apple.svg";
import androidIcon from "../../theme/images/android.svg";
import {
  Avatar,
  Skeleton,
  Box,
} from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const IMG = import.meta.env.VITE_IMAGE_URL;

export default function FeedbackView({ userId, open, onClose }) {
  const [expandedDevices, setExpandedDevices] = useState({});
  const toggleDevice = (id) =>
    setExpandedDevices((prev) => ({ ...prev, [id]: !prev[id] }));
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !open) return;
    setUser(null);
    axios
      .get(
        `${import.meta.env.VITE_API_BASEURL}/auth/getFeedbackById/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.status === 1) setUser(res.data.data);
      })
      .catch((err) => console.error("Error fetching feedback:", err));
  }, [userId, open]);

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

  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateOnly = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <SwipeableDrawer
      className="custom-modal-main dialog-sidebar"
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={() => { }}
      disableSwipeToOpen
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400, md: 480 },
          overflow: "hidden",
        },
      }}
    >
      {/* Sticky Header */}
      <div className="modal-header sticky-header">
        <h3 className="mb-0 modal-title">
          Feedback Detail
        </h3>

        <button
          onClick={onClose}
          className="btn-close in-close"
        />
      </div>


      {/* Scrollable Content */}
      <div
        className="modal-body"
        style={{
          overflowY: "auto",
          height: "100%",
        }}
      >

        {!user ? (
          <div className="user-details-table table data-info-sidebar">
            <table>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i}>
                    <td width="35%">
                      <Skeleton animation="wave" height={24} />
                    </td>

                    <td width="65%">
                      <Skeleton animation="wave" height={24} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (

          <div className="user-details-table table data-info-sidebar">
            <table>
              <tbody>

                {/* ── Profile Information ── */}
                <tr>
                  <td colSpan="2" className="section-title">Profile Information</td>
                </tr>

                <tr>
                  <td width="35%" className="table-label">Profile Image</td>
                  <td width="65%">
                    <Avatar
                      src={user.profilePicture ? `${IMG}${user.profilePicture}` : undefined}
                      sx={{ width: 52, height: 52 }}
                    >
                      {user.firstName?.[0]}
                    </Avatar>
                  </td>
                </tr>

                <tr>
                  <td className="table-label">Name</td>
                  <td>{user.firstName} {user.lastName}</td>
                </tr>

                <tr>
                  <td className="table-label">Email</td>
                  <td style={{ wordBreak: "break-word" }}>{user.email || "N/A"}</td>
                </tr>

                <tr>
                  <td className="table-label">Role</td>
                  <td>
                    <span className="badge badge-light-primary">
                      {roleMap[user.role] || user.role}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="table-label">Total Feedbacks</td>
                  <td>{user.totalFeedbacks ?? user.feedbacks?.length ?? 0}</td>
                </tr>

                {/* ── One section per feedback entry ── */}
                {(() => {
                  const feedbacks = user.feedbacks || [];

                  // Group by date string
                  const groups = {};
                  feedbacks.forEach((fb) => {
                    const dateKey = formatDateOnly(fb.dateTime);
                    if (!groups[dateKey]) groups[dateKey] = [];
                    groups[dateKey].push(fb);
                  });

                  return Object.entries(groups).map(([dateKey, items]) => (
                    <Fragment key={dateKey}>
                      {/* Date section header */}
                      <tr>
                        <td colSpan="2" className="section-title">{dateKey}</td>
                      </tr>

                      {items.map((fb) => (
                        <Fragment key={fb.id}>
                          <tr>
                            <td className="table-label">Feedback Time</td>
                            <td>
                              {new Date(fb.dateTime).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>
                          </tr>

                          <tr>
                            <td className="table-label">Share Experience</td>
                            <td>{fb.experience || "N/A"}</td>
                          </tr>

                          <tr>
                            <td className="table-label">Feature Request</td>
                            <td>{fb.features || "N/A"}</td>
                          </tr>

                          {/* Device info toggle */}

                          {expandedDevices[fb.id] && (
                            <>
                              <tr>
                                <td className="table-label">Device</td>
                                <td>{fb.deviceInfo?.mobileName || "N/A"}</td>
                              </tr>

                              <tr>
                                <td className="table-label">Device Platform</td>
                                <td>
                                  <span className="d-inline-flex align-items-center gap-1">
                                    {deviceTypeMap[fb.deviceInfo?.deviceType]?.icon && (
                                      <img
                                        src={deviceTypeMap[fb.deviceInfo.deviceType].icon}
                                        alt={deviceTypeMap[fb.deviceInfo.deviceType].label}
                                        width="16"
                                        height="16"
                                      />
                                    )}
                                    {deviceTypeMap[fb.deviceInfo?.deviceType]?.label || "N/A"}
                                  </span>
                                </td>
                              </tr>

                              <tr>
                                <td className="table-label">App Version</td>
                                <td>{fb.deviceInfo?.versionCode || "N/A"}</td>
                              </tr>

                              <tr>
                                <td className="table-label">OS Version</td>
                                <td>{fb.deviceInfo?.osVersion || "N/A"}</td>
                              </tr>
                            </>
                          )}
                          <tr>
                            <td colSpan="2" style={{ paddingBottom: 6 }}>
                              <span
                                style={{ cursor: "pointer", fontSize: 13, fontWeight: 500, textDecoration: "underline", color: "#d74315" }}
                                onClick={() => toggleDevice(fb.id)}
                              >
                                {expandedDevices[fb.id] ? "Device Info" : "Device Info"}
                              </span>
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    </Fragment>
                  ));
                })()}

              </tbody>
            </table>
          </div>

        )}

      </div>

    </SwipeableDrawer>
  );
}