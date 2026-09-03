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
import LoadingButton from "@mui/lab/LoadingButton";
export default function AddUserDialog({ open, onClose, onSuccess, fixedRole }) {

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    companyType: "",
  });
  const [loading, setLoading] = useState(false);
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
    companyType:
      fixedRole === "construction_admin"
        ? "Construction Admin"
        : fixedRole === "truck_operator_admin"
          ? "Truck Operator Admin"
          : "",
    role: fixedRole || "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "companyType" ? { role: value } : {}),
    }));

    setErrors((prev) => {
      const updatedErrors = { ...prev };

      if (name === "fullName") {
        if (!value.trim()) {
          updatedErrors.fullName = "Full Name is required";
        } else if (value.trim().length < 3) {
          updatedErrors.fullName = "Full Name must be at least 3 characters";
        } else {
          updatedErrors.fullName = "";
        }
      }

      if (name === "email") {
        if (!value.trim()) {
          updatedErrors.email = "Email is required";
        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ) {
          updatedErrors.email = "Please enter a valid email address";
        } else {
          updatedErrors.email = "";
        }
      }

      if (name === "companyType") {
        updatedErrors.companyType = value
          ? ""
          : "Company Type is required";
      }

      return updatedErrors;
    });
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
    const newErrors = {
      fullName: "",
      email: "",
      companyType: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!fixedRole && !formData.companyType) {
      newErrors.companyType = "Company Type is required";
    }

    setErrors(newErrors);

    if (
      newErrors.fullName ||
      newErrors.email ||
      newErrors.companyType
    ) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/createAdmin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === 1) {
        setErrors({
          fullName: "",
          email: "",
          companyType: "",
        });

        showSuccessPopup(res.data.message);
        onSuccess();
      } else {
        showErrorPopup(res.data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);

      showErrorPopup(
        error?.response?.data?.message ||
        error?.message ||
        "Error creating user"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      className="custom-modal-main"
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      {/* Header */}
      <div className="modal-header">
        <h3 className="mb-0 modal-title">{fixedRole === "construction_admin"
          ? "Add Construction Company"
          : fixedRole === "truck_operator_admin"
            ? "Add Truck Operator Company"
            : "Add Company"}</h3>
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
              error={!!errors.fullName}
              helperText={errors.fullName}
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
              error={!!errors.email}
              helperText={errors.email}
              inputProps={{
                className: "form-control border",
              }}
            />
          </div>
          {!fixedRole && (
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
          )}
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
          loading={loading}
          disabled={loading}
        >
          Save
        </button>
      </div>
    </Dialog>
  );
}
