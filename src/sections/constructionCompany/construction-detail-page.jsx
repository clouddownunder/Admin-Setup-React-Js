/* eslint-disable */
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "src/components/iconify";
import ConstructionTableHead from "./construction-table-head";
import ConstructionTableToolbar from "./construction-table-toolbar";
import TableEmptyRows from "./table-empty-rows";
import TableNoData from "./table-no-data";
import { emptyRows, applyFilter } from "./utils";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// ─── helpers ──────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_BASEURL;
const IMG = import.meta.env.VITE_IMAGE_URL;
const avatarSrc = (url) => (url ? `${IMG}${url}` : undefined);

const formatMobileNumber = (number) => {
    if (!number) return "N/A";
    const digits = number.replace(/\D/g, "");
    if (digits.length === 10) return digits.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
    if (digits.length === 9) return `+61 ${digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}`;
    return digits;
};

const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

// ─── Initials Avatar ──────────────────────────────────────────────────────────
function InitialsAvatar({ name, size = 40, bgColor = "#E8F0FE", textColor = "#1A56DB" }) {
    const initials = (name || "?")
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    return (
        <Avatar
            sx={{
                width: size,
                height: size,
                bgcolor: bgColor,
                color: textColor,
                fontSize: size * 0.35,
                fontWeight: 600,
            }}
        >
            {initials}
        </Avatar>
    );
}

// ─── Info Row (for company profile card) ──────────────────────────────────────
function InfoRow({ label, value }) {
    return (
        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 140, fontWeight: 500 }}
            >
                {label}
            </Typography>
            <Typography variant="body2">{value || "N/A"}</Typography>
        </Box>
    );
}

// ─── Job Poster Profile Popup ─────────────────────────────────────────────────
function JobPosterProfileSidebar({ open, onClose, user }) {
    const [showDevice, setShowDevice] = useState(false);
    if (!user) return null;
    function capitalizeName(name) {
        if (!name) return "N/A";

        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return (
        <SwipeableDrawer
            className="custom-modal dialog-sidebar"
            anchor="right"
            open={open}
            onClose={onClose}
            onOpen={() => { }}
            disableSwipeToOpen
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 400, md: 480 },
                    overflowX: "hidden",
                },
            }}
        >
            <div className="modal-header">
                <h3 className="mb-0 modal-title">Job Poster Profile</h3>
                <button onClick={onClose} className="btn-close in-close" />
            </div>

            <div className="modal-body">

                <div className="user-details-table table data-info-sidebar">
                    <table>
                        <tbody>

                            {/* Profile Information */}
                            <tr>
                                <td colSpan="2" className="section-title">
                                    Profile Information
                                </td>
                            </tr>


                            {/* Profile Image */}
                            <tr>
                                <td width="35%" className="table-label">
                                    Profile Image
                                </td>

                                <td width="65%">
                                    {user.profileImage || user.profilePicture ? (
                                        <a
                                            href={avatarSrc(
                                                user.profileImage || user.profilePicture
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Avatar
                                                className="st-avtar img-fluid rounded-circle border"
                                                src={avatarSrc(
                                                    user.profileImage || user.profilePicture
                                                )}
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <InitialsAvatar
                                            name={user.fullName}
                                            size={60}
                                            bgColor="#DEF7EC"
                                            textColor="#057A55"
                                        />
                                    )}
                                </td>
                            </tr>


                            {/* Name */}
                            <tr>
                                <td className="table-label">
                                    Name
                                </td>

                                <td>
                                    {user.fullName || "N/A"}
                                </td>
                            </tr>


                            {/* Email */}
                            <tr>
                                <td className="table-label">
                                    Email
                                </td>

                                <td style={{ wordBreak: "break-word" }}>
                                    {user.email || "N/A"}
                                </td>
                            </tr>


                            {/* Mobile */}
                            <tr>
                                <td className="table-label">
                                    Mobile
                                </td>

                                <td>
                                    {formatMobileNumber(
                                        user.mobileNo || user.mobile
                                    )}
                                </td>
                            </tr>



                            {/* Account Information */}
                            <tr>
                                <td colSpan="2" className="section-title">
                                    Account Information
                                </td>
                            </tr>


                            {/* Profile Setup */}
                            <tr>
                                <td className="table-label">
                                    Profile Setup
                                </td>

                                <td>
                                    <span
                                        className={`status-badge badge ${user.isProfileSetUp
                                            ? "success-box"
                                            : "danger-box"
                                            }`}
                                    >
                                        {user.isProfileSetUp
                                            ? "Completed"
                                            : "Incomplete"}
                                    </span>
                                </td>
                            </tr>



                            {/* Created Date */}
                            <tr>
                                <td className="table-label">
                                    Created Date
                                </td>

                                <td>
                                    {formatDate(user.createdAt)}
                                </td>
                            </tr>
                            {showDevice && (
                                <>
                                    <tr>
                                        <td colSpan="2" className="section-title">
                                            Device Information
                                        </td>
                                    </tr>


                                    {/* Device Type */}
                                    <tr>
                                        <td className="table-label">Device Type</td>
                                        <td>
                                            {user.deviceDetails?.deviceType === 1
                                                ? "iOS"
                                                : user.deviceDetails?.deviceType === 2
                                                    ? "Android"
                                                    : "N/A"}
                                        </td>
                                    </tr>
                                    {/* App Version */}
                                    <tr>
                                        <td className="table-label">Version Code</td>
                                        <td>{user.deviceDetails?.versionCode || "N/A"}</td>
                                    </tr>
                                    {/* OS Version */}
                                    <tr>
                                        <td className="table-label">OS Version</td>
                                        <td>{user.deviceDetails?.osVersion || "N/A"}</td>
                                    </tr>
                                    {/* Device Name */}
                                    <tr>
                                        <td className="table-label">Device Name</td>
                                        <td>{capitalizeName(user.deviceDetails?.mobileName) || "N/A"}</td>
                                    </tr>

                                    {/* App Environment */}
                                    <tr>
                                        <td className="table-label">App Environment</td>
                                        <td>
                                            {user?.deviceDetails?.appEnvironment ? (
                                                <span
                                                    className={`status-badge badge ${user.deviceDetails.appEnvironment === "production"
                                                        ? "success-box"
                                                        : user.deviceDetails.appEnvironment === "development"
                                                            ? "blue-box"
                                                            : ""
                                                        }`}
                                                >
                                                    {capitalizeName(user.deviceDetails.appEnvironment)}
                                                </span>
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                    </tr>

                                    {/* Server Environment */}
                                    <tr>
                                        <td className="table-label">Server Environment</td>
                                        <td>
                                            {user?.deviceDetails?.serverEnvironment ? (
                                                <span
                                                    className={`status-badge badge ${user.deviceDetails.serverEnvironment === "production"
                                                        ? "success-box"
                                                        : user.deviceDetails.serverEnvironment === "development"
                                                            ? "blue-box"
                                                            : ""
                                                        }`}
                                                >
                                                    {capitalizeName(user.deviceDetails.serverEnvironment)}
                                                </span>
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                    </tr>



                                </>
                            )}
                            <tr>
                                <td colSpan="2" style={{ paddingBottom: 6 }}>
                                    <span
                                        style={{ cursor: "pointer", fontSize: 13, fontWeight: 500, textDecoration: "underline", color: "#d74315" }}
                                        onClick={() => setShowDevice((p) => !p)}
                                    >
                                        {showDevice ? "Device Info" : "Device Info"}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </SwipeableDrawer>
    );
}

// ─── Skeleton rows for the table ──────────────────────────────────────────────
function TableSkeletonRows({ rows = 5, cols = 5 }) {
    return [...Array(rows)].map((_, i) => (
        <tr key={i}>
            {[...Array(cols)].map((_, j) => (
                <TableCell key={j}>
                    <Skeleton animation="wave" height={38} />
                </TableCell>
            ))}
        </tr>
    ));
}

// ─── Detail Page ──────────────────────────────────────────────────────────────
export default function ConstructionCompanyDetailView() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // company data — prefer router state for instant render, fallback to fetch
    const [company, setCompany] = useState(state?.company || null);

    // job posters
    const [jobPosters, setJobPosters] = useState([]);
    const [loadingPosters, setLoadingPosters] = useState(true);

    // table controls
    const [filterName, setFilterName] = useState("");
    const [page, setPage] = useState(0);           // 0-indexed for MUI
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState([]);

    // poster profile popup
    const [selectedPoster, setSelectedPoster] = useState(null);
    const [posterDialogOpen, setPosterDialogOpen] = useState(false);

    // ── fetch company if not in router state ──
    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setLoadingPosters(true);

        axios
            .get(`${API}/auth/getAllUsers`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    filter: "job_poster",
                    createdBy: id,
                    search: filterName,
                    page: page + 1,      // API is 1-indexed
                    limit: rowsPerPage,
                },
            })
            .then((r) => {
                if (cancelled) return;
                const payload = r.data?.data || {};
                setJobPosters((payload.data || []).map((u) => ({ ...u, name: u.fullName || "" })));
                setTotal(payload.total || 0);
            })
            .catch(() => { if (!cancelled) setJobPosters([]); })
            .finally(() => { if (!cancelled) setLoadingPosters(false); });

        return () => { cancelled = true; };
    }, [id, filterName, page, rowsPerPage]);

    // ── fetch job posters ──
    useEffect(() => {
        if (!id) return;
        setLoadingPosters(true);
        axios
            .get(`${API}/auth/getAllUsers`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { filter: "job_poster" },
            })
            .then((r) => {
                const all = r.data?.data?.data || [];

                const mine = all
                    .filter(
                        (u) =>
                            String(u.createdBy?.id) === String(id) ||
                            String(u.createdBy?._id) === String(id)
                    )
                    .map((u) => ({
                        ...u,
                        name: u.fullName || "",
                    }));

                setJobPosters(mine);
            })
            .catch(() => setJobPosters([]))
            .finally(() => setLoadingPosters(false));
    }, [id]);

    // ── table derived state ──
    const dataFiltered = applyFilter({ inputData: jobPosters, filterName });
    const notFound = !dataFiltered.length && !!filterName;
    const noData = !dataFiltered.length && !filterName && !loadingPosters;

    const openPosterProfile = (poster) => {
        setSelectedPoster(poster);
        setPosterDialogOpen(true);
    };
    const CustomRedArrowIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="custom-select-arrow red"
        >
            <path
                d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                fill="currentColor"
            ></path>
        </svg>
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }}>
            {/* ── Page header ── */}
            <Stack direction="row" alignItems="center" spacing={1} mb={4}>
                <Tooltip title="Back">
                    <IconButton onClick={() => navigate(-1)}>
                        <Iconify icon="eva:arrow-back-fill" />
                    </IconButton>
                </Tooltip>
                <h1 className="page-title mb-0">Construction Company Details</h1>
            </Stack>

            <Grid container spacing={3}>
                {/* ── Left: Company profile card ── */}
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3, boxShadow: 3, height: "100%" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Stack alignItems="center" spacing={2} mb={3}>
                                    {company?.profileImage ? (
                                        <a
                                            href={avatarSrc(company.profileImage)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Avatar
                                                src={avatarSrc(company.profileImage)}
                                                sx={{ width: 80, height: 80 }}
                                            />
                                        </a>
                                    ) : (
                                        <InitialsAvatar name={company?.fullName} size={80} />
                                    )}
                                    <Box textAlign="center">
                                        <Typography variant="h6">{company?.fullName || "—"}</Typography>
                                        <Chip
                                            label="Construction Company"
                                            size="small"
                                            color="primary"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={1}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {/* Desktop */}
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        display: { xs: "none", md: "block" },
                                    }}
                                />

                                {/* Mobile */}
                                <Divider
                                    sx={{
                                        display: { xs: "block", md: "none" },
                                        width: "100%",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={7}>
                                {company ? (
                                    <>
                                        <InfoRow
                                            label="Email"
                                            value={
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        wordBreak: "break-word",
                                                        overflowWrap: "break-word",
                                                    }}
                                                >
                                                    {company.email}
                                                </Typography>
                                            }
                                        />
                                        <InfoRow
                                            label="Mobile"
                                            value={formatMobileNumber(company.mobile)}
                                        />
                                        <InfoRow
                                            label="Profile Setup"
                                            value={
                                                <Chip
                                                    label={company.isProfileSetUp ? "Completed" : "Incomplete"}
                                                    size="small"
                                                    color={company.isProfileSetUp ? "success" : "primary"}
                                                    variant="contained"
                                                />
                                            }
                                        />
                                        <InfoRow label="Created Date" value={formatDate(company.createdAt)} />
                                    </>
                                ) : (
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton key={i} height={28} sx={{ mb: 1 }} />
                                    ))
                                )}
                            </Grid>
                        </Grid>


                    </Card>
                </Grid>

                {/* ── Right: Job Posters table card ── */}
                <Grid item xs={12} md={12}>
                    <div className="page-header">
                        <h1 className="page-title mb-0">Associated Users</h1>
                    </div>
                    <div className="page-content notification-page cm-page-panel pt-3">
                        <Card sx={{ p: 0 }} className="panel">
                            <Box className="panel-body parent-table">
                                {/* Top row */}
                                <div className="row customrow mb-3 gy-2" style={{ padding: "0 16px", paddingTop: "16px" }}>
                                    <div className="col1">
                                        <div className="show-page-row">
                                            <TablePagination
                                                className="custom-pagination remove-buttons"
                                                page={page}
                                                component="div"
                                                count={total}                    // ← server total
                                                rowsPerPage={rowsPerPage}
                                                onPageChange={(_, newPage) => setPage(newPage)}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                onRowsPerPageChange={(e) => {
                                                    setPage(0);
                                                    setRowsPerPage(parseInt(e.target.value, 10));
                                                }}
                                                SelectProps={{
                                                    IconComponent: CustomRedArrowIcon,
                                                    MenuProps: {
                                                        PaperProps: {
                                                            className: "rows-per-page-menu",
                                                        },
                                                        MenuListProps: {
                                                            className: "rows-per-page-menu-list",
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col1">
                                        <div className="rows-serach-wrap d-flex align-items-end justify-content-md-end">
                                            <ConstructionTableToolbar
                                                numSelected={selected.length}
                                                filterName={filterName}
                                                onFilterName={(e) => { setPage(0); setFilterName(e.target.value); }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <TableContainer className="table">
                                    <Table sx={{ minWidth: 560 }}>
                                        <ConstructionTableHead
                                            rowCount={jobPosters.length}
                                            numSelected={selected.length}
                                            headLabel={[
                                                { id: "name", label: "Name" },
                                                { id: "email", label: "Email" },
                                                { id: "mobile", label: "Mobile" },
                                                { id: "createdAt", label: "Created Date" },
                                                { id: "profileSetup", label: "Profile Setup" },
                                                { id: "actions", label: "Actions" },
                                            ]}
                                        />

                                        <TableBody>
                                            {loadingPosters && <TableSkeletonRows rows={rowsPerPage} cols={6} />}

                                            {!loadingPosters &&
                                                dataFiltered
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((poster) => (
                                                        <tr
                                                            key={poster._id || poster.id}
                                                        // style={{ cursor: "pointer" }}
                                                        // onClick={() => openPosterProfile(poster)}
                                                        >
                                                            {/* Name */}
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                padding="none"
                                                                sx={{ pl: 2 }}
                                                            >
                                                                <Stack
                                                                    direction="row"
                                                                    alignItems="center"
                                                                    spacing={1.5}
                                                                >
                                                                    {poster.profileImage ? (
                                                                        <Avatar
                                                                            src={avatarSrc(poster.profileImage)}
                                                                            sx={{ width: 34, height: 34 }}
                                                                        />
                                                                    ) : (
                                                                        <InitialsAvatar
                                                                            name={poster.fullName}
                                                                            size={34}
                                                                            bgColor="#DEF7EC"
                                                                            textColor="#057A55"
                                                                        />
                                                                    )}
                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        noWrap
                                                                    >
                                                                        {poster.fullName || "N/A"}
                                                                    </Typography>
                                                                </Stack>
                                                            </TableCell>

                                                            {/* Email */}
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {poster.email || "N/A"}
                                                                </Typography>
                                                            </TableCell>

                                                            {/* Mobile */}
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {formatMobileNumber(
                                                                        poster.mobileNo || poster.mobile
                                                                    )}
                                                                </Typography>
                                                            </TableCell>

                                                            {/* Joined */}
                                                            <TableCell>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {formatDate(poster.createdAt)}
                                                                </Typography>
                                                            </TableCell>
                                                            {/* Profile Setup */}
                                                            <TableCell>
                                                                <Chip
                                                                    label={
                                                                        poster.isProfileSetUp
                                                                            ? "Completed"
                                                                            : "Incomplete"
                                                                    }
                                                                    size="small"
                                                                    color={
                                                                        poster.isProfileSetUp
                                                                            ? "success"
                                                                            : "primary"
                                                                    }
                                                                    variant="contained"
                                                                />
                                                            </TableCell>



                                                            {/* Actions — stop propagation so row click doesn't also fire */}
                                                            <TableCell
                                                                align="left"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Tooltip title="View Profile">

                                                                    <Iconify
                                                                        icon="eva:eye-fill"
                                                                        className="dt-view-btn dt-eye-icon"
                                                                        onClick={() =>
                                                                            openPosterProfile(poster)
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </TableCell>
                                                        </tr>
                                                    ))}

                                            {!loadingPosters && notFound && <TableNoData query={filterName} />}
                                            {!loadingPosters && noData && <TableNoData query="job posters" />}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Bottom pagination */}
                                <TablePagination
                                    className="custom-pagination pagination-buttons"
                                    component="div"
                                    count={total}                    // ← server total
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    onPageChange={(_, newPage) => setPage(newPage)}
                                    rowsPerPageOptions={[]}
                                    labelRowsPerPage=""
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                                />
                            </Box>
                        </Card>
                    </div>
                </Grid>
            </Grid>

            {/* ── Job Poster Profile Popup ── */}
            <JobPosterProfileSidebar
                open={posterDialogOpen}
                onClose={() => {
                    setPosterDialogOpen(false);
                    setSelectedPoster(null);
                }}
                user={selectedPoster}
            />
        </Container>
    );
}