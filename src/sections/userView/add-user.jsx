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
    companyType: "construction_admin",
    role: "construction_admin",
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
      className="custom-modal add-user-modal"
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{}}
    >
      {/* Header */}
      <div className="modal-header">
        <h3 className="mb-0 modal-title">Add Company</h3>
      </div>

      {/* Main content */}
      <div className="modal-body pb-0" dividers>
        <div className="add-user-form">
          <div className="field-group input-field">
            <label htmlFor="fullName" className="main-label mb-1">
              Full Name
            </label>
            <TextField
              fullWidth
              placeholder="Enter full name"
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              inputProps={{
                className: "form-control border",
              }}
            />
          </div>
          <div className="field-group input-field">
            <label htmlFor="email" className="main-label mb-1">
              Email
            </label>
            <TextField
              fullWidth
              placeholder="Enter email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              inputProps={{
                className: "form-control border",
              }}
            />
          </div>

          <div className="field-group input-field">
            <label htmlFor="companyType" className="main-label mb-1">
              Company Type
            </label>
            <TextField
              select
              fullWidth
              required
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              inputProps={{
                className: "form-control border selectinput",
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    className: "select-type-menu-wrap",
                  },
                  MenuListProps: {
                    className: "select-type-menu",
                  },
                },
              }}
            >
              <MenuItem value="construction_admin" className="select-type-item">
                Construction Admin
              </MenuItem>
              <MenuItem
                value="truck_operator_admin"
                className="select-type-item"
              >
                Truck Operator Admin
              </MenuItem>
            </TextField>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClose}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-primary ms-2"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </Dialog>
  );
}
