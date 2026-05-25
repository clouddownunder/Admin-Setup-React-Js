/* eslint-disable */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { showSuccess, showError } from "src/utils/swalTheme";

export default function AddUserDialog({ open, onClose, onSuccess }) {
  const token = localStorage.getItem("token");
  const theme = useTheme(); // ✅ GET THEME HERE
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const initialFormState = {
    fullName: "",
    email: "",
    companyType: "",
    role: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "companyType") {
      setFormData({
        ...formData,
        companyType: value,
        role: value, // ✅ auto assign role same as companyType
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const showSuccessPopup = (message) => {
    showSuccess(theme, message); // ✅ PASS THEME
    resetForm(); // ✅ clear fields
    onClose();
  };

  const showErrorPopup = (message) => {
    showError(theme, message); // ✅ PASS THEME
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.companyType) {
      showErrorPopup("Please fill all the fields");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/createAdmin`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.status === 1) {
        showSuccessPopup(res.data.message);
        onSuccess();
      } else {
        showErrorPopup(res.data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      showErrorPopup("Error creating user");
    }
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "none",
          backgroundColor: "rgba(0,0,0,0.35)",
        },
      }}
    >
      <DialogTitle>Add User</DialogTitle>

      <DialogContent>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Full Name"
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            select
            fullWidth
            label="Company Type"
            required
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="construction_admin">Construction Admin</MenuItem>
            <MenuItem value="truck_operator_admin">
              Truck Operator Admin
            </MenuItem>
          </TextField>
        </Box>

        <DialogActions sx={{ pr: 0 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
