/* eslint-disable */
import { useState, useEffect, useCallback } from "react";
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import { Switch } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TableRow from "@mui/material/TableRow";

import TruckOperatorTableHead from "./operator-table-head";
import TruckOperatorTableToolbar from "./operator-table-toolbar";
import TableNoData from "./table-no-data";
import Iconify from "src/components/iconify";
import { showError, showSuccess } from "../../utils/swalTheme";
import { useTheme } from "@mui/material/styles";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function InitialsAvatar({ name, size = 40, bgColor = "#FDF6B2", textColor = "#C27803" }) {
    const initials = (name || "?")
        .split(" ").slice(0, 2)
        .map((w) => w[0]).join("").toUpperCase();
    return (
        <Avatar sx={{ width: size, height: size, bgcolor: bgColor, color: textColor, fontSize: size * 0.35, fontWeight: 600 }}>
            {initials}
        </Avatar>
    );
}

function InfoRow({ label, value }) {
    return (
        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontWeight: 700 }}>
                {label}
            </Typography>
            <Typography variant="body2" component="div">{value || "N/A"}</Typography>
        </Box>
    );
}

const CustomRedArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="custom-select-arrow red">
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor" />
    </svg>
);

// ─── Employee Profile Sidebar ─────────────────────────────────────────────────

function EmployeeProfileSidebar({ open, onClose, user, roleLabel }) {
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
            PaperProps={{ sx: { width: { xs: "100%", sm: 400, md: 480 }, overflowX: "hidden" } }}
        >
            <div className="modal-header">
                <h3 className="mb-0 modal-title">{roleLabel} Profile</h3>
                <button onClick={onClose} className="btn-close in-close" />
            </div>

            <div className="modal-body">
                <div className="user-details-table table data-info-sidebar">
                    <table>
                        <tbody>
                            <tr>
                                <td colSpan="2" className="section-title">Profile Information</td>
                            </tr>
                            <tr>
                                <td width="35%" className="table-label">Profile Image</td>
                                <td width="65%">
                                    {user.profileImage || user.profilePicture ? (
                                        <a href={avatarSrc(user.profileImage || user.profilePicture)} target="_blank" rel="noopener noreferrer">
                                            <Avatar
                                                className="st-avtar img-fluid rounded-circle border"
                                                src={avatarSrc(user.profileImage || user.profilePicture)}
                                                sx={{ width: 60, height: 60, objectFit: "cover", cursor: "pointer" }}
                                            />
                                        </a>
                                    ) : (
                                        <InitialsAvatar name={user.fullName} size={60} bgColor="#E8F0FE" textColor="#1A56DB" />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="table-label">Name</td>
                                <td>{user.fullName || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="table-label">Email</td>
                                <td style={{ wordBreak: "break-word" }}>{user.email || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="table-label">Mobile</td>
                                <td>
                                    {user.mobile || user.mobileNo
                                        ? formatMobileNumber(user.mobile || user.mobileNo)
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="section-title">Account Information</td>
                            </tr>
                            <tr>
                                <td className="table-label">Profile Setup</td>
                                <td>
                                    <span className={`status-badge badge ${user.isProfileSetUp ? "success-box" : "danger-box"}`}>
                                        {user.isProfileSetUp ? "Completed" : "Incomplete"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="table-label">Created Date</td>
                                <td>{formatDate(user.createdAt)}</td>
                            </tr>
                            {showDevice && (
                                <>
                                    <tr>
                                        <td colSpan="2" className="section-title">Device Information</td>
                                    </tr>
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
                                    <tr>
                                        <td className="table-label">Version Code</td>
                                        <td>{user.deviceDetails?.versionCode || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td className="table-label">OS Version</td>
                                        <td>{user.deviceDetails?.osVersion || "N/A"}</td>
                                    </tr>
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
                                        Device Info
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

// ─── Truck Detail Sidebar ─────────────────────────────────────────────────────

function TruckDetailSidebar({ open, onClose, truck }) {
    if (!truck) return null;
    const docs = truck.documents || [];

    return (
        <SwipeableDrawer
            className="custom-modal dialog-sidebar"
            anchor="right"
            open={open}
            onClose={onClose}
            onOpen={() => { }}
            disableSwipeToOpen
            PaperProps={{ sx: { width: { xs: "100%", sm: 400, md: 520 }, overflowX: "hidden" } }}
        >
            <div className="modal-header">
                <h3 className="mb-0 modal-title">Truck Details</h3>
                <button onClick={onClose} className="btn-close in-close" />
            </div>

            <div className="modal-body">
                <div className="user-details-table table data-info-sidebar">
                    <table>
                        <tbody>
                            <tr>
                                <td width="40%" className="table-label">Truck Images</td>
                                <td width="60%">
                                    {truck.images?.length > 0 ? (
                                        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                                            {truck.images.slice(0, 4).map((img, i) => (
                                                <Stack key={i} spacing={0.5} alignItems="center">
                                                    <a href={img.imageUrl} target="_blank" rel="noopener noreferrer">
                                                        <Avatar
                                                            variant="rounded"
                                                            src={img.imageUrl}
                                                            sx={{ width: 80, height: 60, borderRadius: 1, bgcolor: "grey.100", cursor: "pointer", "& img": { objectFit: "contain" } }}
                                                        />
                                                    </a>
                                                </Stack>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Stack spacing={0.5} alignItems="center">
                                            <a href={avatarSrc(truck?.equipmentType?.imageUrl)} target="_blank" rel="noopener noreferrer">
                                                <Avatar
                                                    variant="rounded"
                                                    src={avatarSrc(truck?.equipmentType?.imageUrl)}
                                                    sx={{ width: 80, height: 60, borderRadius: 1, bgcolor: "grey.100", cursor: "pointer", "& img": { objectFit: "contain" } }}
                                                />
                                            </a>
                                            <Typography variant="caption">{truck.equipmentType?.name || "Truck Image"}</Typography>
                                        </Stack>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="user-details-table table data-info-sidebar">
                    <table>
                        <tbody>
                            <tr>
                                <td width="40%" className="table-label">Registration No.</td>
                                <td width="60%">{truck.truckNumber || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="table-label">Truck Type</td>
                                <td>{truck.equipmentType?.name || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="table-label">Hourly Rate</td>
                                <td>{truck.hourlyRate ? `$${truck.hourlyRate}/hr` : "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="table-label">Min Hire Hours</td>
                                <td>{truck.minimumHireHours ? `${truck.minimumHireHours} hrs` : "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="table-label">Travel Charge</td>
                                <td>{truck.travelCharge ? `$${truck.travelCharge}` : "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="table-label">Block Status</td>
                                <td>
                                    <Chip
                                        label={truck.isBlocked ? "Blocked" : "Unblocked"}
                                        size="small"
                                        color={truck.isBlocked ? "primary" : "success"}
                                        variant="contained"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {Array.isArray(docs) && docs.length > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" fontWeight="bold" mb={2}>Uploaded Documents</Typography>
                        <Box sx={{ bgcolor: "grey.100", borderRadius: 1, p: 1, mb: 1 }}>
                            <Stack direction="row">
                                <Typography variant="subtitle2" sx={{ flex: 1 }}>Document</Typography>
                                <Typography variant="subtitle2" sx={{ width: 120, textAlign: "center" }}>Expiry Date</Typography>
                                <Typography variant="subtitle2" sx={{ width: 70, textAlign: "center" }}>Action</Typography>
                            </Stack>
                        </Box>
                        {docs.map((doc, i) =>
                            doc.documentUrl ? (
                                <Stack
                                    key={i}
                                    direction="row"
                                    alignItems="center"
                                    sx={{ py: 1, borderBottom: i !== docs.length - 1 ? "1px solid" : "none", borderColor: "divider" }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                                        <Iconify icon="mdi:file-document-outline" width={18} />
                                        <Typography variant="body2">{doc.optionValue || "Document"}</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{ width: 120, textAlign: "center" }}>
                                        {doc.expiryDate || "-"}
                                    </Typography>
                                    <Box sx={{ width: 70, textAlign: "center" }}>
                                        <Button size="small" variant="outlined" href={doc.documentUrl} target="_blank" rel="noreferrer">
                                            View
                                        </Button>
                                    </Box>
                                </Stack>
                            ) : null
                        )}
                    </>
                )}
            </div>
        </SwipeableDrawer>
    );
}

// ─── Employee Table (server-side search + pagination) ─────────────────────────

function EmployeeTable({
    list, loading, roleLabel, bgColor, textColor, onView,
    filterName, onFilterName,
    page, rowsPerPage, total, onPageChange, onRowsPerPageChange,
}) {
    const notFound = !list.length && !!filterName;

    const skeletonRows = [...Array(rowsPerPage)].map((_, i) => (
        <TableRow key={i}>
            {[1, 2, 3, 4, 5, 6].map((c) => (
                <TableCell key={c}><Skeleton animation="wave" height={38} /></TableCell>
            ))}
        </TableRow>
    ));

    return (
        <Box>
            <div className="row customrow mb-3 gy-2" style={{ padding: "0 16px" }}>
                <div className="col1">
                    <div className="show-page-row">
                        <TablePagination
                            className="custom-pagination remove-buttons"
                            page={page}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            onPageChange={onPageChange}
                            rowsPerPageOptions={[ 10, 25, 50, 100]}
                            onRowsPerPageChange={onRowsPerPageChange}
                            SelectProps={{
                                IconComponent: CustomRedArrowIcon,
                                MenuProps: {
                                    PaperProps: { className: "rows-per-page-menu" },
                                    MenuListProps: { className: "rows-per-page-menu-list" },
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="col1">
                    <div className="rows-serach-wrap d-flex align-items-end justify-content-md-end">
                        <TruckOperatorTableToolbar
                            numSelected={0}
                            filterName={filterName}
                            onFilterName={onFilterName}
                        />
                    </div>
                </div>
            </div>

            <TableContainer className="table">
                <Table sx={{ minWidth: 500 }}>
                    <TruckOperatorTableHead
                        rowCount={list.length}
                        numSelected={0}
                        headLabel={[
                            { id: "name", label: "Name" },
                            { id: "email", label: "Email" },
                            { id: "mobile", label: "Mobile" },
                            { id: "createdAt", label: "Created Date" },
                            { id: "profileSetup", label: "Profile Setup" },
                            { id: "actions", label: "Actions", align: "center" },
                        ]}
                    />
                    <TableBody>
                        {loading && skeletonRows}
                        {!loading && list.map((emp) => (
                            <TableRow key={emp._id || emp.id} hover>
                                <TableCell component="th" scope="row" padding="none" sx={{ pl: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        {emp.profileImage ? (
                                            <Avatar src={avatarSrc(emp.profileImage)} sx={{ width: 32, height: 32 }} />
                                        ) : (
                                            <InitialsAvatar name={emp.fullName} size={32} bgColor={bgColor} textColor={textColor} />
                                        )}
                                        <Typography variant="body2" fontWeight={500}>
                                            {emp.fullName || "N/A"}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{emp.email || "N/A"}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {emp.mobile ? formatMobileNumber(emp.mobile) : "N/A"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{emp.createdAt || "N/A"}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={emp.isProfileSetUp ? "Completed" : "Incomplete"}
                                        size="small"
                                        color={emp.isProfileSetUp ? "success" : "primary"}
                                        variant="contained"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="View Profile" placement="top" arrow>
                                        <Iconify
                                            icon="eva:eye-fill"
                                            width={18}
                                            onClick={(e) => { e.stopPropagation(); onView(emp); }}
                                            className="dt-view-btn dt-eye-icon"
                                        />
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!loading && notFound && <TableNoData query={filterName} />}
                        {!loading && !list.length && !filterName && <TableNoData query={roleLabel + "s"} />}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                className="custom-pagination pagination-buttons"
                component="div"
                count={total}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                rowsPerPageOptions={[]}
                labelRowsPerPage=""
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
            />
        </Box>
    );
}

// ─── Trucks Table (client-side search + pagination) ───────────────────────────

function TrucksTable({ trucks, loading, onView, onBlock, blockingId,
    filterName, onFilterName,
    page, rowsPerPage, total, onPageChange, onRowsPerPageChange, }) {
    const [blockDialogTruck, setBlockDialogTruck] = useState(null);

    const notFound = !trucks.length && !!filterName;

    const skeletonRows = [...Array(rowsPerPage)].map((_, i) => (
        <TableRow key={i}>
            {[1, 2, 3, 4, 5, 6].map((c) => (
                <TableCell key={c}><Skeleton animation="wave" height={38} /></TableCell>
            ))}
        </TableRow>
    ));

    const getStatusLabel = (status) => {
        switch (status) {
            case "unutilized": return "Unutilized";
            case "on_the_move": return "On The Move";
            case "in_maintenance": return "In Maintenance";
            default: return "N/A";
        }
    };

    return (
        <Box>
            <div className="row customrow mb-3 gy-2" style={{ padding: "0 16px" }}>
                <div className="col1">
                    <div className="show-page-row">
                        <TablePagination
                            className="custom-pagination remove-buttons"
                            page={page}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            onPageChange={onPageChange}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            onRowsPerPageChange={onRowsPerPageChange}
                            SelectProps={{
                                IconComponent: CustomRedArrowIcon,
                                MenuProps: {
                                    PaperProps: { className: "rows-per-page-menu" },
                                    MenuListProps: { className: "rows-per-page-menu-list" },
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="col1">
                    <div className="rows-serach-wrap d-flex align-items-end justify-content-md-end">
                        <TruckOperatorTableToolbar
                            numSelected={0}
                            filterName={filterName}
                            onFilterName={onFilterName}
                        />
                    </div>
                </div>
            </div>

            <TableContainer className="table">
                <Table sx={{ minWidth: 500 }}>
                    <TruckOperatorTableHead
                        rowCount={trucks.length}
                        numSelected={0}
                        headLabel={[
                            { id: "truck", label: "Truck" },
                            { id: "type", label: "Type" },
                            { id: "hourlyRate", label: "Hourly Rate" },
                            { id: "status", label: "Status" },
                            { id: "blockStatus", label: "Block Status" },
                            { id: "actions", label: "Actions", align: "center" },
                        ]}
                    />
                    <TableBody>
                        {loading && skeletonRows}
                        {!loading && trucks.map((truck) => {
                            const tId = truck.id || truck._id;
                            const isBlocking = blockingId === tId;
                            return (
                                <TableRow key={tId} hover>
                                    <TableCell component="th" scope="row" padding="none" sx={{ pl: 2 }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Avatar
                                                variant="rounded"
                                                src={truck.equipmentType?.imageUrl ? `${IMG}${truck.equipmentType.imageUrl}` : undefined}
                                                sx={{ width: 60, height: 40, borderRadius: 1, bgcolor: "grey.100", flexShrink: 0, "& img": { objectFit: "contain" } }}
                                            >
                                                <Iconify icon="mdi:truck" width={20} />
                                            </Avatar>
                                            <Typography variant="body2" fontWeight={500}>
                                                {truck.truckNumber || "N/A"}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{truck.equipmentType?.name || "N/A"}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {truck.equipmentType?.equipmentType || ""}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {truck.hourlyRate ? `$${truck.hourlyRate}/hr` : "N/A"}
                                        </Typography>
                                        {truck.minimumHireHours && (
                                            <Typography variant="caption" color="text.secondary">
                                                Min {truck.minimumHireHours} hrs
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatusLabel(truck.status)}
                                            size="small"
                                            variant="contained"
                                            color={
                                                truck.status === "on_the_move" ? "success"
                                                    : truck.status === "in_maintenance" ? "primary"
                                                        : truck.status === "unutilized" ? "warning"
                                                            : "default"
                                            }
                                        />
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Switch
                                            checked={!!truck.isBlocked}
                                            color="success"
                                            disabled={isBlocking}
                                            onChange={() => setBlockDialogTruck(truck)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="View Truck Details" placement="top" arrow>
                                            <Iconify
                                                icon="eva:eye-fill"
                                                width={18}
                                                onClick={() => onView(truck)}
                                                className="dt-view-btn dt-eye-icon"
                                            />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {!loading && notFound && <TableNoData query={filterName} />}
                        {!loading && !trucks.length && !filterName && <TableNoData query="trucks" />}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                className="custom-pagination pagination-buttons"
                component="div"
                count={total}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                rowsPerPageOptions={[]}
                labelRowsPerPage=""
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
            />

            {/* Block/Unblock confirmation dialog — unchanged */}
            <Dialog open={!!blockDialogTruck} onClose={() => setBlockDialogTruck(null)} maxWidth="xs">
                <DialogTitle>
                    {blockDialogTruck?.isBlocked ? "Unblock Truck" : "Block Truck"}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to{" "}
                        <strong>{blockDialogTruck?.isBlocked ? "unblock" : "block"}</strong>{" "}
                        truck <strong>{blockDialogTruck?.truckNumber}</strong>?
                    </Typography>
                    {!blockDialogTruck?.isBlocked && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: "warning.lighter", borderRadius: 1, border: "1px solid", borderColor: "warning.light" }}>
                            <Typography variant="body2" color="warning.dark">
                                Trucks with active or upcoming bookings/jobs cannot be blocked.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={() => setBlockDialogTruck(null)}
                        disabled={blockingId === (blockDialogTruck?.id || blockDialogTruck?._id)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color={blockDialogTruck?.isBlocked ? "success" : "primary"}
                        disabled={blockingId === (blockDialogTruck?.id || blockDialogTruck?._id)}
                        startIcon={
                            blockingId === (blockDialogTruck?.id || blockDialogTruck?._id)
                                ? <CircularProgress size={14} color="inherit" />
                                : null
                        }
                        onClick={() => { onBlock(blockDialogTruck); setBlockDialogTruck(null); }}
                    >
                        {blockDialogTruck?.isBlocked ? "Unblock" : "Block"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// ─── Main Detail View ─────────────────────────────────────────────────────────

export default function TruckOperatorCompanyDetailView() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const token = localStorage.getItem("token");

    const [company, setCompany] = useState(state?.company || null);
    const [employees, setEmployees] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [loadingEmp, setLoadingEmp] = useState(true);
    const [loadingTrucks, setLoadingTrucks] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    const [selectedUser, setSelectedUser] = useState(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [userRoleLabel, setUserRoleLabel] = useState("");
    const [userChipColor, setUserChipColor] = useState("primary");

    const [selectedTruck, setSelectedTruck] = useState(null);
    const [truckDialogOpen, setTruckDialogOpen] = useState(false);
    const [blockingTruckId, setBlockingTruckId] = useState(null);

    // Employee server-side pagination + search
    const [empFilterName, setEmpFilterName] = useState("");
    const [empPage, setEmpPage] = useState(0);
    const [empRowsPerPage, setEmpRowsPerPage] = useState(25);
    const [empTotal, setEmpTotal] = useState(0);

    // Truck client-side search
    const [truckFilterName, setTruckFilterName] = useState("");
    const [truckPage, setTruckPage] = useState(0);
    const [truckRowsPerPage, setTruckRowsPerPage] = useState(25);
    const [truckTotal, setTruckTotal] = useState(0);

    // ── Fetch company if not passed via router state ──
    useEffect(() => {
        if (company) return;
        axios
            .get(`${API}/auth/getAllUsers`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { filter: "truck_operator_admin" },
            })
            .then((r) => {
                const found = (r.data?.data || []).find((u) => String(u._id) === String(id));
                if (found) setCompany({ ...found, name: found.fullName || "" });
            })
            .catch(console.error);
    }, [id]);

    // ── Fetch employees (server-side, re-runs on tab/search/page change) ──
    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setLoadingEmp(true);

        const roleByTab = activeTab === 0 ? "job_accepter" : "driver";

        axios
            .get(`${API}/auth/getAllUsers`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    filter: roleByTab,
                    createdBy: id,
                    search: empFilterName,
                    page: empPage + 1,
                    limit: empRowsPerPage,
                },
            })
            .then((r) => {
                if (cancelled) return;
                const payload = r.data?.data || {};
                setEmployees(payload.data || []);
                setEmpTotal(payload.total || 0);
            })
            .catch(() => { if (!cancelled) setEmployees([]); })
            .finally(() => { if (!cancelled) setLoadingEmp(false); });

        return () => { cancelled = true; };
    }, [id, activeTab, empFilterName, empPage, empRowsPerPage]);

    // ── Fetch trucks (client-side search, refetch after block/unblock) ──
    const fetchTrucks = useCallback(() => {
        if (!id) return;
        setLoadingTrucks(true);
        axios
            .get(`${API}/auth/getFleetsByAdmin/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    search: truckFilterName,
                    page: truckPage + 1,
                    limit: truckRowsPerPage,
                },
            })
            .then((r) => {
                const payload = r.data?.data || {};
                setTrucks(payload.data || []);
                setTruckTotal(payload.total || 0);
            })
            .catch(() => setTrucks([]))
            .finally(() => setLoadingTrucks(false));
    }, [id, token, truckFilterName, truckPage, truckRowsPerPage]);

    useEffect(() => {
        fetchTrucks();
    }, [fetchTrucks]);

    // ── Tab change resets page + search ──
    const handleTabChange = (_, v) => {
        setActiveTab(v);
        setEmpPage(0);
        setEmpFilterName("");
    };

    const handleEmpFilter = (e) => {
        setEmpFilterName(e.target.value);
        setEmpPage(0);
    };
    const handleTruckFilter = (e) => {
        setTruckFilterName(e.target.value);
        setTruckPage(0);
    };

    const openUserProfile = (user, label, color) => {
        setSelectedUser(user);
        setUserRoleLabel(label);
        setUserChipColor(color);
        setUserDialogOpen(true);
    };

    const handleBlockTruck = async (truck) => {
        const isBlocked = truck.isBlocked;
        const action = isBlocked ? "unblock" : "block";
        const tId = truck.id || truck._id;

        setBlockingTruckId(tId);
        try {
            const res = await axios.post(
                `${API}/auth/blockFleet`,
                { fleetId: tId, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.status === 1) {
                showSuccess(theme, res.data.message);
                fetchTrucks();
            } else {
                showError(theme, res.data.message);
            }
        } catch (err) {
            showError(theme, err?.response?.data?.message || "Operation failed");
        } finally {
            setBlockingTruckId(null);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }}>
            {/* ── Header ── */}
            <Stack direction="row" alignItems="center" spacing={1} mb={4}>
                <Tooltip title="Back">
                    <IconButton onClick={() => navigate(-1)}>
                        <Iconify icon="eva:arrow-back-fill" />
                    </IconButton>
                </Tooltip>
                <h1 className="page-title mb-0">Truck Operator Company Details</h1>
            </Stack>

            <Grid container spacing={3}>
                {/* ── Company Profile Card ── */}
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3, boxShadow: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Stack alignItems="center" spacing={2} mb={3}>
                                    {company?.profileImage ? (
                                        <a href={avatarSrc(company.profileImage)} target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer" }}>
                                            <Avatar src={avatarSrc(company.profileImage)} sx={{ width: 80, height: 80 }} />
                                        </a>
                                    ) : (
                                        <InitialsAvatar name={company?.fullName} size={80} />
                                    )}
                                    <Box textAlign="center">
                                        <Typography variant="h6">{company?.fullName || "—"}</Typography>
                                        <Chip label="Truck Operator Company" size="small" color="primary" sx={{ mt: 0.5 }} />
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
                                <Divider sx={{ display: { xs: "block", md: "none" }, width: "100%" }} />
                            </Grid>

                            <Grid item xs={12} md={7}>
                                {company ? (
                                    <>
                                        <InfoRow
                                            label="Email"
                                            value={
                                                <Typography variant="body2" sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                                                    {company.email}
                                                </Typography>
                                            }
                                        />
                                        <InfoRow label="Mobile" value={company.mobile ? formatMobileNumber(company.mobile) : "N/A"} />
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
                                        <InfoRow
                                            label="Block Status"
                                            value={
                                                <Chip
                                                    label={company.isBlocked === "Blocked" || company.isBlocked === true ? "Blocked" : "Unblocked"}
                                                    size="small"
                                                    color={company.isBlocked === "Blocked" || company.isBlocked === true ? "primary" : "success"}
                                                    variant="contained"
                                                />
                                            }
                                        />
                                        <InfoRow label="Created Date" value={company.createdAt} />
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

                {/* ── Associated Users + Trucks ── */}
                <Grid item xs={12} md={12}>
                    <Stack spacing={3}>
                        <div className="page-header">
                            <h1 className="page-title mb-0">Associated Users</h1>
                        </div>
                        <div className="page-content notification-page cm-page-panel pt-3">
                            <div className="panel">
                                <div className="table-tabs-wrap">
                                    <Tabs
                                        value={activeTab}
                                        onChange={handleTabChange}
                                        className="table-tabs company-table-tabs"
                                    >
                                        <Tab label="Job Accepters" value={0} className="tab-pane-btn" />
                                        <Tab label="Drivers" value={1} className="tab-pane-btn" />
                                    </Tabs>
                                </div>

                                <div className="panel-body parent-table">
                                    {activeTab === 0 && (
                                        <EmployeeTable
                                            list={employees}
                                            loading={loadingEmp}
                                            roleLabel="Job Accepter"
                                            bgColor="#E8F0FE"
                                            textColor="#1A56DB"
                                            filterName={empFilterName}
                                            onFilterName={handleEmpFilter}
                                            page={empPage}
                                            rowsPerPage={empRowsPerPage}
                                            total={empTotal}
                                            onPageChange={(_, newPage) => setEmpPage(newPage)}
                                            onRowsPerPageChange={(e) => { setEmpRowsPerPage(parseInt(e.target.value, 10)); setEmpPage(0); }}
                                            onView={(emp) => openUserProfile(emp, "Job Accepter", "primary")}
                                        />
                                    )}
                                    {activeTab === 1 && (
                                        <EmployeeTable
                                            list={employees}
                                            loading={loadingEmp}
                                            roleLabel="Driver"
                                            bgColor="#DEF7EC"
                                            textColor="#057A55"
                                            filterName={empFilterName}
                                            onFilterName={handleEmpFilter}
                                            page={empPage}
                                            rowsPerPage={empRowsPerPage}
                                            total={empTotal}
                                            onPageChange={(_, newPage) => setEmpPage(newPage)}
                                            onRowsPerPageChange={(e) => { setEmpRowsPerPage(parseInt(e.target.value, 10)); setEmpPage(0); }}
                                            onView={(emp) => openUserProfile(emp, "Driver", "success")}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="page-header">
                            <h1 className="page-title mb-0">Associated Trucks</h1>
                        </div>
                        <div className="page-content notification-page cm-page-panel pt-3">
                            <div className="panel">
                                <div className="panel-body parent-table">
                                    <TrucksTable
                                        trucks={trucks}
                                        loading={loadingTrucks}
                                        onView={(truck) => { setSelectedTruck(truck); setTruckDialogOpen(true); }}
                                        onBlock={handleBlockTruck}
                                        blockingId={blockingTruckId}
                                        filterName={truckFilterName}
                                        onFilterName={handleTruckFilter}
                                        page={truckPage}
                                        rowsPerPage={truckRowsPerPage}
                                        total={truckTotal}
                                        onPageChange={(_, newPage) => setTruckPage(newPage)}
                                        onRowsPerPageChange={(e) => { setTruckRowsPerPage(parseInt(e.target.value, 10)); setTruckPage(0); }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Stack>
                </Grid>
            </Grid>

            <EmployeeProfileSidebar
                open={userDialogOpen}
                onClose={() => setUserDialogOpen(false)}
                user={selectedUser}
                roleLabel={userRoleLabel}
            />

            <TruckDetailSidebar
                open={truckDialogOpen}
                onClose={() => setTruckDialogOpen(false)}
                truck={selectedTruck}
            />
        </Container>
    );
}