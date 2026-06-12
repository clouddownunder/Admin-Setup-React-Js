/* eslint-disable */
import {
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { deleteCookie, getCookie, setCookie } from "../../utils/format-user";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { showSuccess, showError } from "../../utils/swalTheme";
import { useTheme } from "@mui/material/styles";

export default function ProfileEditView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+61",
    mobileNo: "",
    adminProfilePic: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [preview, setPreview] = useState(null);
  const showSuccessPopup = (message) => {
    showSuccess(theme, message); // ✅ PASS THEME
  };

  const showErrorPopup = (message) => {
    showError(theme, message); // ✅ PASS THEME
  };
  // -------------------- Load User Data --------------------
  useEffect(() => {
    const user = getCookie("UserData");
    if (!user) return;

    const parsed = JSON.parse(decodeURIComponent(user));

    setFormData({
      fullName: parsed.fullName || "",
      email: parsed.email || "",
      countryCode: parsed.countryCode || "+61",
      mobileNo: parsed.mobileNo ? formatPhoneForDisplay(parsed.mobileNo) : "",
      adminProfilePic: null, // keep this null for new uploads
    });

    // Use the actual uploaded image from cookie
    if (parsed.profilePicture) {
      setPreview(
        `${import.meta.env.VITE_IMAGE_URL.replace(/\/$/, "")}${
          parsed.profilePicture
        }`
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // -------------------- Helpers --------------------
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    return digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  };
  const handleCountryCodeChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("+")) value = "+" + value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, countryCode: value }));
  };
  const formatPhoneForBackend = (phone) => phone.replace(/\D/g, "");

  // -------------------- Handlers --------------------
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "adminProfilePic") {
      const file = files?.[0];
      if (!file) return;

      setFormData((prev) => ({ ...prev, adminProfilePic: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    if (name === "mobileNo") {
      setFormData((prev) => ({
        ...prev,
        mobileNo: formatPhoneForDisplay(value),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------- Submit Profile --------------------
  const handleProfileSubmit = async () => {
    try {
      if (!formData.fullName || !formData.email || !formData.mobileNo) {
        return showErrorPopup("Please fill all the fields");
      }
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("countryCode", formData.countryCode);
      form.append("mobileNo", formatPhoneForBackend(formData.mobileNo));

      if (formData.adminProfilePic) {
        form.append("adminProfilePic", formData.adminProfilePic);
      }

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/editAdmin`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === 1) {
        console.log(res,"response profile")
        showSuccessPopup(res.data.message);
        deleteCookie("UserData");
        setCookie("UserData", JSON.stringify(res.data.data));
        window.dispatchEvent(
          new CustomEvent("userDataUpdated", {
            detail: res.data.data,
          })
        );
        setFormData((prev) => ({
          ...prev,
          fullName: res.data.data.fullName || "",
          email: res.data.data.email || "",
          countryCode: res.data.data.countryCode || "+61",
          mobileNo: formatPhoneForDisplay(res.data.data.mobileNo || ""),
          adminProfilePic: null,
        }));
      
        setPreview(
          `${import.meta.env.VITE_IMAGE_URL.replace(/\/$/, "")}${
            res.data.data.profilePicture
          }`
        );
      } else {
        showErrorPopup(res.data.message);
      }
    } catch (err) {
      showErrorPopup(err.response?.data?.message?.message);
    }
  };

  // -------------------- Submit Password --------------------
  const handlePasswordSubmit = async () => {
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      return showErrorPopup("Please fill all the fields");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showErrorPopup("New password and confirm password do not match.");
    }

    try {
      const token = localStorage.getItem("token");
      console.log(token, "token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/auth/changePassword`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res, "resposnse");
      if (res.data.status === 1) {
        showSuccessPopup(res.data.message);
        localStorage.removeItem("token");
        deleteCookie("UserData");
        navigate("/login");
      } else {
        showErrorPopup(res.data.message);
      }
    } catch (err) {
      showErrorPopup(err.response?.data?.message || "Something went wrong");
    }
  };


  // -------------------- UI --------------------
  return (
    <div className="page-content profile-edit-main">
      {/* OUTER ROW */}
      <div className="row g-3">
        {/* LEFT PROFILE CARD */}
        <div className="col-lg-3">
          <div className="profile-view text-center">
            <Avatar className="profile-avatar" src={preview || ""} />
            <h5 className="profile-avatar-name">{formData.fullName}</h5>
            <p className="profile-sub mb-1">{formData.email}</p>
            <p className="profile-sub mb-0">+61 {formatPhoneForDisplay(formData.mobileNo)}</p>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-lg-9">
          <div className="profile-security-main">
            <div className="profile-header">
              <h2 className="profile-title-main mb-1">Profile & Security</h2>

              <p className="sub-text">
                Manage your account information and keep it secure.
              </p>
            </div>
            {/* INNER ROW */}
            <div className="profile-security-wrapper">
              <div className="row">
                {/* PROFILE INFO */}
                <div className="col-12 col-md-6">
                  <div className="card-rl card-right pe-0 pe-md-3">
                    <div className="sec-header">
                      {/* HEADER */}
                      <div className="d-flex align-items-center gap-2 mb-4">
                        <Avatar className="icon-rounded">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="main-icon"
                          >
                            <path d="M12 12C14.76 12 17 9.76 17 7S14.76 2 12 2 7 4.24 7 7 9.24 12 12 12ZM12 14C8.67 14 2 15.67 2 19V22H22V19C22 15.67 15.33 14 12 14Z" />
                          </svg>
                        </Avatar>

                        <div className="header-title">
                          <span className="subtitle1 fw-700">
                            Profile Information
                          </span>
                          <p className="sub-header mb-0">
                            Update your personal information.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* NAME */}
                    <div className="mb-4">
                      <div className="title-text mb-2 subtitle1">Name</div>

                      <TextField
                        fullWidth
                        name="fullName"
                        // placeholder="Full Name"
                        value={formData.fullName || ""}
                        onChange={handleProfileChange}
                        required
                        className="input-field"
                        InputProps={{
                          inputProps: {
                            className: "form-control border",
                          },
                        }}
                      />
                    </div>

                    {/* EMAIL */}
                    <div className="mb-4">
                      <div className="title-text mb-2 subtitle1">Email</div>

                      <TextField
                        fullWidth
                        name="email"
                        // placeholder="Email"
                        value={formData.email || ""}
                        onChange={handleProfileChange}
                        required
                        className="input-field"
                        InputProps={{
                          inputProps: {
                            className: "form-control border",
                          },
                        }}
                      />
                    </div>

                    {/* MOBILE ROW */}
                    <div className="row g-2 mb-4">
                      <div className="col-3">
                        <div className="title-text mb-2 subtitle1">Code*</div>

                        <TextField
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleCountryCodeChange}
                          required
                          className="input-field"
                          InputProps={{
                            readOnly:true,
                            inputProps: {
                              className: "form-control border",
                            },
                          }}
                        />
                      </div>

                      <div className="col-9">
                        <div className="title-text mb-2 subtitle1">Mobile*</div>

                        <TextField
                          fullWidth
                          name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleProfileChange}
                          required
                          className="input-field"
                          InputProps={{
                            inputProps: {
                              className: "form-control border",
                            },
                          }}
                        />
                      </div>
                    </div>

                    {/* PROFILE IMAGE */}
                    <div className="mb-4">
                      <div className="title-text mb-2 subtitle1">
                        Profile Picture
                      </div>

                      <div className="upload-profile">
                        <Avatar
                          className="profile-avatar img-fluid rounded-circle me-2"
                          src={preview || ""}
                        />

                        <Button
                          className="btn btn-upload d-flex align-items-center justify-content-center gap-1 lh-base"
                          variant="outlined"
                          component="label"
                        >
                          <span className="upload-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              fill="currentColor"
                            >
                              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                            </svg>
                          </span>
                          <span className="fw-500 caption">Upload Image</span>
                          <input
                            type="file"
                            name="adminProfilePic"
                            accept="image/*"
                            hidden
                            onChange={handleProfileChange}
                          />
                        </Button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 lh-base"
                      onClick={handleProfileSubmit}
                    >
                      <span className="upload-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          width="14"
                          height="14"
                          fill="currentColor"
                        >
                          <g>
                            <circle cx="256" cy="298.667" r="42.667"></circle>
                            <path
                              d="M480.768,87.936l-56.704-56.704c-5.674-5.585-11.957-10.515-18.731-14.699V64
                                 c-0.071,58.881-47.786,106.596-106.667,106.667h-85.333C154.452,170.596,106.737,122.881,106.667,64V0
                                 C47.786,0.071,0.071,47.786,0,106.667v298.667C0.071,464.215,47.786,511.93,106.667,512h298.667
                                 C464.214,511.93,511.93,464.215,512,405.334V163.35C512.08,135.049,500.833,107.893,480.768,87.936z M256,384
                                 c-47.128,0-85.333-38.205-85.333-85.333s38.205-85.333,85.333-85.333s85.333,38.205,85.333,85.333
                                 S303.128,384,256,384z"
                            ></path>
                            <path
                              d="M213.333,128h85.333c35.346,0,64-28.654,64-64V1.366c-4.638-0.756-9.32-1.212-14.016-1.365H149.333v64
                                 C149.333,99.346,177.987,128,213.333,128z"
                            ></path>
                          </g>
                        </svg>
                      </span>

                      <span
                        className="profile-sub-text fw-500"
                      >
                        Save Profile
                      </span>
                    </button>
                  </div>
                </div>

                {/* PASSWORD SECTION */}
                <div className="col-12 col-md-6 border-left">
                  <div className="card-rl ps-0 ps-md-3">
                    <div className="sec-header">
                      {/* HEADER */}
                      <div className="d-flex align-items-center gap-2 mb-4">
                        <Avatar className="icon-rounded">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="main-icon"
                          >
                            <path d="M405.333 179.712v-30.379C405.333 66.859 338.475 0 256 0S106.667 66.859 106.667 149.333v30.379c-38.826 16.945-63.944 55.259-64 97.621v128C42.737 464.214 90.452 511.93 149.333 512h213.333c58.881-.07 106.596-47.786 106.667-106.667v-128c-.055-42.362-25.174-80.676-64-97.621zM277.333 362.667c0 11.782-9.551 21.333-21.333 21.333c-11.782 0-21.333-9.551-21.333-21.333V320c0-11.782 9.551-21.333 21.333-21.333c11.782 0 21.333 9.551 21.333 21.333v42.667zM362.667 170.667H149.333v-21.333C149.333 90.423 197.09 42.667 256 42.667s106.667 47.756 106.667 106.667v21.333z" />
                          </svg>
                        </Avatar>

                        <div className="header-title">
                          <span className="subtitle1 fw-700">
                            Change Password
                          </span>
                          <p className="sub-header mb-0">
                            Ensure your account is secure.
                          </p>
                        </div>
                      </div>

                      {/* {renderPasswordField("Current Password", "oldPassword")}
                      <Box sx={{ height: 20 }} />
                      {renderPasswordField("New Password", "newPassword")}
                      <Box sx={{ height: 20 }} />
                      {renderPasswordField("Confirm Password", "confirmPassword"
                      )} */}

                      <div className="mb-4">
                        <div className="title-text mb-2 subtitle1">
                          Current Password
                        </div>

                        <TextField
                          fullWidth
                          name="currentPassword"
                          placeholder="Enter current password"
                          required
                          className="input-field"
                          type={
                            showPassword.currentPassword ? "text" : "password"
                          }
                          value={passwordData.currentPassword || ""}
                          onChange={handlePasswordChange}
                          InputProps={{
                            inputProps: {
                              className: "form-control border",
                            },
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                className="pass-eye-icon"
                              >
                                <IconButton
                                  onClick={() =>
                                    handleClickShowPassword("currentPassword")
                                  }
                                  edge="end"
                                  sx={{ color: "black" }}
                                >
                                  <Icon
                                    icon={
                                      showPassword.currentPassword
                                        ? "eva:eye-off-fill"
                                        : "eva:eye-fill"
                                    }
                                    fontSize={18}
                                    style={{ color: "black" }}
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>

                      <div className="mb-4">
                        <div className="title-text mb-2 subtitle1">
                          New Password
                        </div>

                        <TextField
                          fullWidth
                          name="newPassword"
                          placeholder="Enter new password"
                          required
                          className="input-field"
                          type={showPassword.newPassword ? "text" : "password"}
                          value={passwordData.newPassword || ""}
                          onChange={handlePasswordChange}
                          InputProps={{
                            inputProps: {
                              className: "form-control border",
                            },
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                className="pass-eye-icon"
                              >
                                <IconButton
                                  onClick={() =>
                                    handleClickShowPassword("newPassword")
                                  }
                                  edge="end"
                                  sx={{ color: "black" }}
                                >
                                  <Icon
                                    icon={
                                      showPassword.newPassword
                                        ? "eva:eye-off-fill"
                                        : "eva:eye-fill"
                                    }
                                    fontSize={18}
                                    style={{ color: "black" }}
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>

                      <div className="mb-4">
                        <div className="title-text mb-2 subtitle1">
                          Confirm New Password
                        </div>

                        <TextField
                          fullWidth
                          name="confirmPassword"
                          placeholder="Confirm new password"
                          required
                          className="input-field"
                          type={
                            showPassword.confirmPassword ? "text" : "password"
                          }
                          value={passwordData.confirmPassword || ""}
                          onChange={handlePasswordChange}
                          InputProps={{
                            inputProps: {
                              className: "form-control border",
                            },
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                className="pass-eye-icon"
                              >
                                <IconButton
                                  onClick={() =>
                                    handleClickShowPassword("confirmPassword")
                                  }
                                  edge="end"
                                  sx={{ color: "black" }}
                                >
                                  <Icon
                                    icon={
                                      showPassword.confirmPassword
                                        ? "eva:eye-off-fill"
                                        : "eva:eye-fill"
                                    }
                                    fontSize={18}
                                    style={{ color: "black" }}
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 lh-base"
                        onClick={handlePasswordSubmit}
                      >
                        <span className="upload-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            width="14"
                            height="14"
                            fill="currentColor"
                          >
                            <path d="M405.333 179.712v-30.379C405.333 66.859 338.475 0 256 0S106.667 66.859 106.667 149.333v30.379c-38.826 16.945-63.944 55.259-64 97.621v128C42.737 464.214 90.452 511.93 149.333 512h213.333c58.881-.07 106.596-47.786 106.667-106.667v-128c-.055-42.362-25.174-80.676-64-97.621zM277.333 362.667c0 11.782-9.551 21.333-21.333 21.333c-11.782 0-21.333-9.551-21.333-21.333V320c0-11.782 9.551-21.333 21.333-21.333c11.782 0 21.333 9.551 21.333 21.333v42.667zM362.667 170.667H149.333v-21.333C149.333 90.423 197.09 42.667 256 42.667s106.667 47.756 106.667 106.667v21.333z" />
                          </svg>
                        </span>

                        <span
                          className="profile-sub-text fw-500"
                        >
                          Change Password
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
