/* eslint-disable */
import { useState, useEffect } from "react";
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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";

import Iconify from "src/components/iconify";
import { showError, showSuccess } from "../../utils/swalTheme";
import { useTheme } from "@mui/material/styles";
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

function InitialsAvatar({ name, size = 40, bgColor = "#E8F0FE", textColor = "#1A56DB" }) {
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
            <Typography variant="body2">{value || "N/A"}</Typography>
        </Box>
    );
}

// ─── Job Poster Profile Dialog ─────────────────────────────────────────────────
function JobPosterProfileDialog({ open, onClose, user }) {
    if (!user) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">Job Poster Profile</Typography>
                    <IconButton size="small" onClick={onClose}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Stack alignItems="center" spacing={2} mb={2}>
                    {user.profileImage || user.profilePicture ? (
                        <Avatar src={avatarSrc(user.profileImage || user.profilePicture)} sx={{ width: 72, height: 72 }} />
                    ) : (
                        <InitialsAvatar name={user.fullName} size={72} bgColor="#DEF7EC" textColor="#057A55" />
                    )}
                    <Box textAlign="center">
                        <Typography variant="h6">{user.fullName || "N/A"}</Typography>
                        <Chip label="Job Poster" size="small" color="success" sx={{ mt: 0.5 }} />
                    </Box>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Mobile" value={user.mobileNo || user.mobile} />
                <InfoRow
                    label="Profile Setup"
                    value={user.isProfileSetUp ? "Completed" : "Incomplete"}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── View Company Dialog ───────────────────────────────────────────────────────
function ViewCompanyDialog({ open, onClose, company }) {
    const [jobPosters, setJobPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoster, setSelectedPoster] = useState(null);
    const [posterDialogOpen, setPosterDialogOpen] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!open || !company) return;
        setLoading(true);
        setJobPosters([]);

        const companyId = company._id || company.id;

        axios
            .get(`${API}/auth/getAllUsers`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { filter: "job_poster" },
            })
            .then((r) => {
                const all = r.data?.data || [];
                const mine = all.filter(
                    (u) =>
                        u.createdBy?.id === companyId ||
                        u.createdBy?._id === companyId ||
                        String(u.createdBy?.id) === String(companyId) ||
                        String(u.createdBy?._id) === String(companyId)
                );
                setJobPosters(mine);
            })
            .catch(() => setJobPosters([]))
            .finally(() => setLoading(false));
    }, [open, company]);

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
                        <Typography variant="h6">Construction Company Details</Typography>
                    </DialogTitle>
                    <IconButton size="small" onClick={onClose}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Box>

                <DialogContent dividers>
                    {/* ── Company profile header ── */}
                    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                        {company.profileImage ? (
                            <Avatar src={avatarSrc(company.profileImage)} sx={{ width: 64, height: 64 }} />
                        ) : (
                            <InitialsAvatar name={company.fullName} size={64} bgColor="#E8F0FE" textColor="#1A56DB" />
                        )}
                        <Box>
                            <Typography variant="h6">{company.fullName || "N/A"}</Typography>
                            <Chip label="Construction Company" size="small" color="primary" sx={{ mt: 0.5 }} />
                        </Box>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {/* ── Basic info ── */}
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="Email" value={company.email} />
                            <InfoRow label="Mobile" value={company.mobile} />
                            <InfoRow label="Profile Setup" value={company.isProfileSetUp ? "Complete" : "Incomplete"} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoRow label="Created By" value={company.createdBy?.fullName} />
                            <InfoRow label="User Type" value="Construction Admin" />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 2 }} />

                    {/* ── Job Posters ── */}
                    <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
                        Job Posters ({loading ? "…" : jobPosters.length})
                    </Typography>

                    {loading ? (
                        <Stack spacing={1}>
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
                            ))}
                        </Stack>
                    ) : jobPosters.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No job posters found for this company.
                        </Typography>
                    ) : (
                        <List disablePadding>
                            {jobPosters.map((poster) => (
                                <ListItem
                                    key={poster._id || poster.id}
                                    onClick={() => { setSelectedPoster(poster); setPosterDialogOpen(true); }}
                                    secondaryAction={
                                        <Tooltip title="View Profile">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedPoster(poster);
                                                    setPosterDialogOpen(true);
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
                                        {poster.profileImage ? (
                                            <Avatar src={avatarSrc(poster.profileImage)} />
                                        ) : (
                                            <InitialsAvatar name={poster.fullName} size={38} bgColor="#DEF7EC" textColor="#057A55" />
                                        )}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" fontWeight={500}>
                                                {poster.fullName || "N/A"}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {poster.email}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>

            <JobPosterProfileDialog
                open={posterDialogOpen}
                onClose={() => setPosterDialogOpen(false)}
                user={selectedPoster}
            />
        </>
    );
}

// ─── Main Row Component ────────────────────────────────────────────────────────
export default function ConstructionCompanyRow({
    name,
    email,
    mobile,
    profileImage,
    isProfileSetUp,
    createdBy,
    createdAt,
    userId,
    onCompanyDeleted,
    company,
}) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [viewOpen, setViewOpen] = useState(false);
    const token = localStorage.getItem("token");

    const handleDeleteClick = async () => {
        const result = await Swal.fire({
            title: "Confirm Delete",
            html: `Are you sure you want to permanently delete <strong>${name}</strong>?<br/>This will also delete all associated job posters and their data.`,
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
                {/* <TableCell>{createdBy || "N/A"}</TableCell> */}
                <TableCell>
                    <Chip
                        label={isProfileSetUp ? "Completed" : "Incomplete"}
                        size="small"
                        color={isProfileSetUp ? "success" : "primary"}
                        variant="contained"
                    />
                </TableCell>
                <TableCell>{createdAt || "N/A"}</TableCell>

                <TableCell align="left">
                    <Tooltip title="View Details" placement="top" arrow>
                        <Iconify icon="eva:eye-fill" onClick={() => navigate(`/construction-companies/${userId}`, { state: { company } })}
                            sx={{ mr: 2 }} className="dt-view-btn dt-eye-icon" />
                    </Tooltip>
                    <Tooltip title="Delete Company" placement="top" arrow>
                        <Iconify icon="eva:trash-2-fill" onClick={handleDeleteClick} className="dt-view-btn dt-delet-icon"
                        />
                    </Tooltip>
                </TableCell>
            </TableRow>

            {/* ── View Dialog ── */}
            <ViewCompanyDialog
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                company={company}
            />

            {/* ── Delete Confirm Dialog ── */}
            {/* <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm">
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to permanently delete{" "}
                        <strong>{name}</strong>?<br /> This will also delete all associated job
                        posters and their data.
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

ConstructionCompanyRow.propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    mobile: PropTypes.string,
    profileImage: PropTypes.string,
    isProfileSetUp: PropTypes.number,
    createdBy: PropTypes.string,
    userId: PropTypes.any,
    onCompanyDeleted: PropTypes.func,
    company: PropTypes.object,
};