/* eslint-disable */
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Iconify from "src/components/iconify";
import { showError, showSuccess } from "../../utils/swalTheme";
import { useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";

// ─── helpers ──────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_BASEURL;
const IMG = import.meta.env.VITE_IMAGE_URL;
const avatarSrc = (url) => (url ? `${IMG}${url}` : undefined);
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


function InitialsAvatar({ name, size = 40, bgColor = "#FDF6B2", textColor = "#C27803" }) {
    const initials = (name || "?")
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    return (
        <Avatar sx={{ width: size, height: size, bgcolor: bgColor, color: textColor, fontSize: size * 0.35, fontWeight: 600 }}>
            {initials}
        </Avatar>
    );
}

function InfoRow({ label, value }) {
    return (
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 160, fontWeight: 500 }}>
                {label}
            </Typography>
            <Typography variant="body2" component="div">{value || "N/A"}</Typography>
        </Box>
    );
}

// ─── Employee Profile Dialog ───────────────────────────────────────────────────
function EmployeeProfileDialog({ open, onClose, user, roleLabel, chipColor }) {
    if (!user) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">{roleLabel} Profile</Typography>
                    <IconButton size="small" onClick={onClose}><Iconify icon="eva:close-fill" /></IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Stack alignItems="center" spacing={2} mb={2}>
                    {user.profileImage || user.profilePicture ? (
                        <Avatar src={avatarSrc(user.profileImage || user.profilePicture)} sx={{ width: 72, height: 72 }} />
                    ) : (
                        <InitialsAvatar name={user.fullName} size={72} bgColor="#E8F0FE" textColor="#1A56DB" />
                    )}
                    <Box textAlign="center">
                        <Typography variant="h6">{user.fullName || "N/A"}</Typography>
                        <Chip label={roleLabel} size="small" color={chipColor || "primary"} sx={{ mt: 0.5 }} />
                    </Box>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Mobile" value={user.mobileNo || user.mobile} />
                <InfoRow label="Profile Setup" value={user.isProfileSetUp ? "Complete" : "Incomplete"} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── Truck Detail Dialog ───────────────────────────────────────────────────────
function TruckDetailDialog({ open, onClose, truck }) {
    if (!truck) return null;

    const docs = truck.fleetDocuments || truck.documents || {};
    const docFields = [
        { label: "Registration Certificate", key: "registrationCertificate" },
        { label: "Insurance", key: "insurance" },
        { label: "Inspection Certificate", key: "inspectionCertificate" },
        { label: "Other Document", key: "otherDocument" },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">Truck Details</Typography>
                    <IconButton size="small" onClick={onClose}><Iconify icon="eva:close-fill" /></IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {/* truck images */}
                {truck.images?.length > 0 && (
                    <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                        {truck.images.slice(0, 4).map((img, i) => (
                            <Avatar key={i} variant="rounded" src={avatarSrc(img.imageUrl)} sx={{ width: 80, height: 60, borderRadius: 1 }} />
                        ))}
                    </Box>
                )}
                <InfoRow label="Registration Number" value={truck.truckNumber} />
                <InfoRow label="Truck Type" value={truck.equipmentType?.name} />
                <InfoRow label="Vehicle Details" value={truck.equipmentType?.equipmentType} />
                <InfoRow label="Hourly Rate" value={truck.hourlyRate ? `$${truck.hourlyRate}/hr` : null} />
                <InfoRow label="Min Hire Hours" value={truck.minimumHireHours ? `${truck.minimumHireHours} hrs` : null} />
                <InfoRow label="Travel Charge" value={truck.travelCharge ? `$${truck.travelCharge}` : null} />
                <InfoRow
                    label="Status"
                    value={
                        <Chip
                            label={truck.isBlocked ? "Blocked" : "Active"}
                            size="small"
                            color={truck.isBlocked ? "primary" : "success"}
                        />
                    }
                />

                {/* documents */}
                {Object.keys(docs).length > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" mb={1}>Uploaded Documents</Typography>
                        {docFields.map(({ label, key }) =>
                            docs[key] ? (
                                <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Iconify icon="mdi:file-document-outline" width={18} />
                                    <Typography variant="body2" sx={{ flex: 1 }}>{label}</Typography>
                                    <Button size="small" variant="outlined" href={`${IMG}${docs[key]}`} target="_blank" rel="noreferrer">
                                        View
                                    </Button>
                                </Box>
                            ) : null
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── View Company Dialog ───────────────────────────────────────────────────────
function ViewOperatorDialog({ open, onClose, company }) {
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
    const token = localStorage.getItem("token");

    const companyId = company?._id || company?.id;

    const fetchEmployees = useCallback(() => {
        if (!companyId) return;
        setLoadingEmp(true);
        axios
            .get(`${API}/auth/getAllUsers`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { filter: "all" },
            })
            .then((r) => {
                const all = r.data?.data || [];
                const mine = all.filter(
                    (u) =>
                        String(u.createdBy?.id) === String(companyId) ||
                        String(u.createdBy?._id) === String(companyId)
                );
                setEmployees(mine);
            })
            .catch(() => setEmployees([]))
            .finally(() => setLoadingEmp(false));
    }, [companyId, token]);

    const fetchTrucks = useCallback(() => {
        if (!companyId) return;
        setLoadingTrucks(true);
        axios
            .get(`${API}/fleet/getFleetByCompany/${companyId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => setTrucks(r.data?.data || []))
            .catch(() => setTrucks([]))
            .finally(() => setLoadingTrucks(false));
    }, [companyId, token]);

    useEffect(() => {
        if (!open) return;
        fetchEmployees();
        fetchTrucks();
    }, [open, fetchEmployees, fetchTrucks]);

    const jobAccepters = employees.filter(
        (e) => e.userType === "Job Accepter" || e.role === "job_accepter"
    );
    const drivers = employees.filter(
        (e) => e.userType === "Driver" || e.role === "driver"
    );

    const openUserProfile = (user, label, color) => {
        setSelectedUser(user);
        setUserRoleLabel(label);
        setUserChipColor(color);
        setUserDialogOpen(true);
    };

    const handleBlockTruck = async (truck) => {
        const isBlocked = truck.isBlocked;
        const action = isBlocked ? "unblock" : "block";
        const truckId = truck.id || truck._id;

        const result = await Swal.fire({
            title: `${action === "block" ? "Block" : "Unblock"} Truck?`,
            text: `Are you sure you want to ${action} truck ${truck.truckNumber}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: action === "block" ? "#C81E1E" : "#057A55",
            cancelButtonColor: "#6B7280",
            confirmButtonText: `Yes, ${action}`,
            background: "#0F172A",
            color: "#FFFFFF",
        });
        if (!result.isConfirmed) return;

        setBlockingTruckId(truckId);
        try {
            const res = await axios.post(
                `${API}/fleet/blockFleet`,
                { fleetId: truckId, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showSuccess(res.data.status === 1, res.data.message);
            if (res.data.status === 1) fetchTrucks();
        } catch (err) {
            showError(false, err?.response?.data?.message || "Operation failed");
        } finally {
            setBlockingTruckId(null);
        }
    };

    const renderSkeletons = () => (
        <Stack spacing={1}>
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
            ))}
        </Stack>
    );

    const renderEmployeeList = (list, roleLabel, chipColor, bgColor, textColor) => {
        if (loadingEmp) return renderSkeletons();
        if (!list.length)
            return (
                <Typography variant="body2" color="text.secondary">
                    No {roleLabel.toLowerCase()}s found for this company.
                </Typography>
            );
        return (
            <List disablePadding>
                {list.map((emp) => (
                    <ListItem
                        key={emp._id || emp.id}
                        onClick={() => openUserProfile(emp, roleLabel, chipColor)}
                        secondaryAction={
                            <Tooltip title="View Profile">
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openUserProfile(emp, roleLabel, chipColor);
                                    }}
                                >
                                    <Iconify icon="eva:eye-fill" width={18} />
                                </IconButton>
                            </Tooltip>
                        }
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            mb: 1,
                            cursor: "pointer",
                            "&:hover": { bgcolor: "action.hover" },
                        }}
                    >
                        <ListItemAvatar>
                            {emp.profileImage ? (
                                <Avatar src={avatarSrc(emp.profileImage)} />
                            ) : (
                                <InitialsAvatar name={emp.fullName} size={38} bgColor={bgColor} textColor={textColor} />
                            )}
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography variant="body2" fontWeight={500}>
                                    {emp.fullName || "N/A"}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="caption" color="text.secondary">
                                    {emp.email}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        );
    };

    if (!company) return null;

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
                BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "none" } }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, pt: 2 }}>
                    <DialogTitle sx={{ p: 0 }}>
                        <Typography variant="h6">Truck Operator Company Details</Typography>
                    </DialogTitle>
                    <IconButton size="small" onClick={onClose}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Box>

                <DialogContent dividers>
                    {/* ── Company header ── */}
                    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                        {company.profileImage ? (
                            <Avatar src={avatarSrc(company.profileImage)} sx={{ width: 64, height: 64 }} />
                        ) : (
                            <InitialsAvatar name={company.fullName} size={64} />
                        )}
                        <Box>
                            <Typography variant="h6">{company.fullName || "N/A"}</Typography>
                            <Chip label="Truck Operator Company" size="small" color="warning" sx={{ mt: 0.5 }} />
                        </Box>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {/* ── Basic info ── */}
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="Email" value={company.email} />
                            <InfoRow label="Mobile" value={company.mobile} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="Profile Setup" value={company.isProfileSetUp ? "Complete" : "Incomplete"} />
                            <InfoRow label="Created By" value={company.createdBy?.fullName} />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 0 }} />

                    {/* ── Sub tabs ── */}
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        sx={{ mb: 2, borderBottom: "1px solid", borderColor: "divider" }}
                    >
                        <Tab label={`Job Accepters (${loadingEmp ? "…" : jobAccepters.length})`} />
                        <Tab label={`Drivers (${loadingEmp ? "…" : drivers.length})`} />
                        <Tab label={`Trucks (${loadingTrucks ? "…" : trucks.length})`} />
                    </Tabs>

                    {/* Job Accepters */}
                    {activeTab === 0 &&
                        renderEmployeeList(jobAccepters, "Job Accepter", "primary", "#E8F0FE", "#1A56DB")}

                    {/* Drivers */}
                    {activeTab === 1 &&
                        renderEmployeeList(drivers, "Driver", "success", "#DEF7EC", "#057A55")}

                    {/* Trucks */}
                    {activeTab === 2 && (
                        loadingTrucks ? renderSkeletons() : trucks.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No trucks found for this company.
                            </Typography>
                        ) : (
                            <Stack spacing={1}>
                                {trucks.map((truck) => {
                                    const tId = truck.id || truck._id;
                                    const isBlocking = blockingTruckId === tId;
                                    return (
                                        <Box
                                            key={tId}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderRadius: 1,
                                                p: 1.5,
                                            }}
                                        >
                                            <Avatar
                                                variant="rounded"
                                                src={truck.images?.[0] ? avatarSrc(truck.images[0].imageUrl) : undefined}
                                                sx={{ width: 48, height: 40, borderRadius: 1, bgcolor: "grey.100" }}
                                            >
                                                <Iconify icon="mdi:truck" width={24} />
                                            </Avatar>
                                            <Box flex={1} minWidth={0}>
                                                <Typography variant="body2" fontWeight={500} noWrap>
                                                    {truck.truckNumber || "N/A"}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {truck.equipmentType?.name || "N/A"}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={truck.isBlocked ? "Blocked" : "Active"}
                                                size="small"
                                                color={truck.isBlocked ? "primary" : "success"}
                                            />
                                            <Tooltip title="View Truck Details">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => { setSelectedTruck(truck); setTruckDialogOpen(true); }}
                                                >
                                                    <Iconify icon="eva:eye-fill" width={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={truck.isBlocked ? "Unblock Truck" : "Block Truck"}>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color={truck.isBlocked ? "success" : "primary"}
                                                        onClick={() => handleBlockTruck(truck)}
                                                        disabled={isBlocking}
                                                    >
                                                        {isBlocking ? (
                                                            <CircularProgress size={14} />
                                                        ) : (
                                                            <Iconify icon={truck.isBlocked ? "mdi:lock-open-variant" : "mdi:lock"} width={16} />
                                                        )}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Employee profile drill-down */}
            <EmployeeProfileDialog
                open={userDialogOpen}
                onClose={() => setUserDialogOpen(false)}
                user={selectedUser}
                roleLabel={userRoleLabel}
                chipColor={userChipColor}
            />

            {/* Truck detail drill-down */}
            <TruckDetailDialog
                open={truckDialogOpen}
                onClose={() => setTruckDialogOpen(false)}
                truck={selectedTruck}
            />
        </>
    );
}

// ─── Main Row ──────────────────────────────────────────────────────────────────
export default function TruckOperatorCompanyRow({
    name,
    email,
    mobile,
    profileImage,
    isProfileSetUp,
    createdBy,
    createdAt,
    isBlocked,
    userId,
    onCompanyDeleted,
    onCompanyUpdated,
    company,
}) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [viewOpen, setViewOpen] = useState(false);
    // const [deleteOpen, setDeleteOpen] = useState(false);
    // const [deleting, setDeleting] = useState(false);
    const [blockOpen, setBlockOpen] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const token = localStorage.getItem("token");
    // ── Delete ──
    const handleDeleteClick = async () => {
        const result = await Swal.fire({
            title: "Confirm Delete",
            html: `Are you sure you want to permanently delete <strong>${name}</strong>?<br/>This will also delete all associated employees (job accepters, drivers) and their data.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "No",
            reverseButtons: true,
            customClass: {
                container: "logout-swal-container",
                popup: "logout-swal-popup",
                title: "logout-swal-title",
                htmlContainer: "logout-swal-text",
                icon: "logout-swal-icon",
                confirmButton: "logout-swal-confirm btn btn-primary",
                cancelButton: "logout-swal-cancel btn btn-lighter-grey",
            },
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axios.delete(
                `${API}/auth/deleteAdmin/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.status === 1) {
                showSuccess(theme, res.data.message);
                onCompanyDeleted?.();
            } else {
                showError(theme, res.data.message);
            }
        } catch (err) {
            showError(theme, err?.response?.data?.message || err.message);
        }
    };

    // ── Block / Unblock ──
    const handleBlockConfirm = async () => {
        const action = isBlocked ? "unblock" : "block";
        setBlocking(true);
        try {
            const res = await axios.post(
                `${API}/auth/blockStatus`,
                { id: userId, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.status === 1) {
                showSuccess(theme, res.data.message);
                onCompanyUpdated?.(userId, action === "block");  // userId + true/false
            } else {
                showError(theme, res.data.message);
            }
        } catch (err) {
            showError(theme, err?.response?.data?.message || err.message);
        } finally {
            setBlocking(false);
            setBlockOpen(false);
        }
    };

    return (
        <>
            {/* ── Table Row ── */}
            <TableRow hover tabIndex={-1}>
                <TableCell component="th" scope="row" padding="none" sx={{ pl: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {profileImage ? (
                            <Avatar src={avatarSrc(profileImage)} sx={{ width: 36, height: 36 }} />
                        ) : (
                            <InitialsAvatar name={name} size={36} />
                        )}
                        <Typography variant="subtitle2" noWrap>
                            {name || "N/A"}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell>{email || "N/A"}</TableCell>

                <TableCell>{mobile ? formatMobileNumber(mobile) : "N/A"}</TableCell>
                <TableCell>{createdAt || "N/A"}</TableCell>
                {/* <TableCell>{createdBy || "N/A"}</TableCell> */}
                <TableCell>
                    <Chip
                        label={isProfileSetUp ? "Completed" : "Incomplete"}
                        size="small"
                        color={isProfileSetUp ? "success" : "primary"}
                        variant="contained"
                    />
                </TableCell>
                <TableCell>
                    <Switch
                        checked={!!isBlocked}            // ← add !! to guard against string "Blocked"
                        color="success"
                        onChange={() => setBlockOpen(true)}
                    />
                </TableCell>

                <TableCell align="left">
                    {/* View */}
                    <Tooltip title="View Details" placement="top" arrow>

                        <Iconify icon="eva:eye-fill" onClick={() => navigate(`/truck-operator-companies/${userId}`, { state: { company } })} sx={{ mr: 2 }} className="dt-view-btn dt-eye-icon" />
                    </Tooltip>
                    {/* Delete */}
                    <Tooltip title="Delete Company" placement="top" arrow>
                        <Iconify icon="eva:trash-2-fill" onClick={handleDeleteClick} className="dt-view-btn dt-delet-icon" />
                    </Tooltip>
                </TableCell>
            </TableRow>

            {/* ── View Dialog ── */}
            <ViewOperatorDialog
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                company={company}
            />

            {/* ── Block / Unblock Dialog ── */}
            <Dialog open={blockOpen} onClose={() => setBlockOpen(false)} maxWidth="xs">
                <DialogTitle>{isBlocked ? "Unblock Company" : "Block Company"}</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to{" "}
                        <strong>{isBlocked ? "unblock" : "block"}</strong>{" "}
                        <strong>{name}</strong>?
                    </Typography>
                    {!isBlocked && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Companies with active or upcoming jobs cannot be blocked.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setBlockOpen(false)} disabled={blocking}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color={isBlocked ? "success" : "primary"}
                        onClick={handleBlockConfirm}
                        disabled={blocking}
                        startIcon={blocking ? <CircularProgress size={14} color="inherit" /> : null}
                    >
                        {isBlocked ? "Unblock" : "Block"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Delete Dialog ── */}
            {/* <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm">
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to permanently delete{" "}
                        <strong>{name}</strong>?
                        <br />
                        This will also delete all associated employees (job accepters, drivers) and their data.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setDeleteOpen(false)} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDeleteConfirm}
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : null}
                    >
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
    );
}

TruckOperatorCompanyRow.propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    mobile: PropTypes.string,
    profileImage: PropTypes.string,
    isProfileSetUp: PropTypes.number,
    createdBy: PropTypes.string,
    isBlocked: PropTypes.bool,
    userId: PropTypes.any,
    onCompanyDeleted: PropTypes.func,
    onCompanyUpdated: PropTypes.func,
    company: PropTypes.object,
};