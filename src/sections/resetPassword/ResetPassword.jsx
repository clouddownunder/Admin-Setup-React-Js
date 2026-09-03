/* eslint-disable */
import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { alpha, useTheme } from "@mui/material/styles";

import { bgGradient } from "src/theme/css";
import Logo from "src/components/logo";

import { showSuccess, showError } from "src/utils/swalTheme";

import Iconify from "src/components/iconify";


export default function ResetPasswordView() {

  const theme = useTheme();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");


  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");


  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);


  const [loading, setLoading] = useState(false);



  const [fieldErrors, setFieldErrors] = useState({

    password: "",

    confirmPassword: "",

  });



  const handleResetPassword = async () => {


    setFieldErrors({

      password: "",

      confirmPassword: "",

    });



    let errors = {};



    if (!password) {

      errors.password = "Password is required";

    }
    else if (password.length < 6) {

      errors.password =
        "Password must be at least 6 characters";

    }



    if (!confirmPassword) {

      errors.confirmPassword =
        "Confirm password is required";

    }
    else if (password !== confirmPassword) {

      errors.confirmPassword =
        "Passwords do not match";

    }



    if (Object.keys(errors).length > 0) {

      setFieldErrors(errors);

      return;

    }



    setLoading(true);



    try {


      const res = await axios.post(

        `${import.meta.env.VITE_API_BASEURL}/auth/adminResetPassword`,

        {

          token,

          newPassword: password,

        }

      );



      if (res.data.status === 1) {


        await showSuccess(

          theme,

          "Password changed successfully"

        );


        navigate("/login");


      }
      else {


        showError(

          theme,

          res.data.message || "Something went wrong"

        );


      }



    } catch (err) {


      console.error(err);



      showError(

        theme,

        err.response?.data?.message ||

        "Something went wrong"

      );


    }



    setLoading(false);


  };




  return (

    <div className="parentform">


      <Box

        className="login-container"

        sx={{

          ...bgGradient({

            color: alpha(

              theme.palette.background.default,

              0.9

            ),

            imgUrl: "/assets/background/overlay_4.jpg",

          }),


          minHeight: "100vh",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

        }}

      >



        <Logo

          className="logo"

          sx={{

            width: "210px",

            height: "auto",

            marginBottom: "20px",

            marginTop: "10px",

          }}

        />




        <Card className="login-cardm1">



          <div className="mb-3">


            <h2 className="fw-bold h4 mb-1">

              Reset Password

            </h2>


            <p className="text-muted subtitle1 mb-0">

              Enter your new password below.

            </p>


          </div>





          <Stack sx={{ mt: 2, mb: 3 }}>




            <Typography

              variant="body2"

              sx={{ mt: 2, mb: 1, fontWeight: 500 }}

            >

              New Password*

            </Typography>





            <TextField


              fullWidth


              name="password"


              placeholder="New Password"


              type={showPassword ? "text" : "password"}


              value={password}



              error={Boolean(fieldErrors.password)}



              helperText={fieldErrors.password}



              onChange={(e) => {

                setPassword(e.target.value);

                setFieldErrors({

                  ...fieldErrors,

                  password: ""

                });

              }}



              className="input-field"



              InputProps={{



                inputProps: {

                  className: "form-control border"

                },



                endAdornment: (


                  <InputAdornment

                    position="end"

                    className="pass-eye-icon"

                  >


                    <IconButton

                      onClick={() => setShowPassword(!showPassword)}

                      edge="end"

                      sx={{ color: "black" }}

                    >


                      <Iconify

                        icon={

                          showPassword

                            ? "eva:eye-fill"

                            : "eva:eye-off-fill"

                        }

                      />


                    </IconButton>



                  </InputAdornment>

                )

              }}



            />






            <Typography

              variant="body2"

              sx={{ mt: 2, mb: 1, fontWeight: 500 }}

            >

              Confirm Password*

            </Typography>






            <TextField



              fullWidth


              name="confirmPassword"


              placeholder="Confirm Password"


              type={showConfirm ? "text" : "password"}


              value={confirmPassword}



              error={Boolean(fieldErrors.confirmPassword)}



              helperText={fieldErrors.confirmPassword}



              onChange={(e) => {


                setConfirmPassword(e.target.value);



                setFieldErrors({

                  ...fieldErrors,

                  confirmPassword: ""

                });


              }}



              className="input-field"



              InputProps={{



                inputProps: {

                  className: "form-control border"

                },



                endAdornment: (


                  <InputAdornment

                    position="end"

                    className="pass-eye-icon"

                  >


                    <IconButton


                      onClick={() => setShowConfirm(!showConfirm)}


                      edge="end"


                      sx={{ color: "black" }}


                    >


                      <Iconify


                        icon={


                          showConfirm

                            ? "eva:eye-fill"

                            : "eva:eye-off-fill"


                        }


                      />


                    </IconButton>


                  </InputAdornment>

                )

              }}



            />



          </Stack>





          <button


            className="login-btn btn btn-primary w-100"


            type="button"


            disabled={loading}



            onClick={handleResetPassword}



          >


            {loading

              ? "Changing..."

              : "Change Password"

            }



          </button>




        </Card>



      </Box>



    </div>

  );


}