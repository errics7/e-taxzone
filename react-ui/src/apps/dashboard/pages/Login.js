import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import API from "../../../utils/host.config";
import axios from "axios";
import { NavLink, Redirect } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, sett } from "../../../redux/userSlice";
import PortalLayout from "../component/Layout";
import RightPanelLogin from "../assets/right-panel-login.png"

function Login(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("xtoken");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        dispatch(sett(decoded));
      } catch (err) {
        dispatch(logout());
      }
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .min(2, "Email minimal 2 characters")
        .max(100, "Maximum 100 characters")
        .required("NIM/NIP/NIPPK required"),
      password: yup
        .string()
        .min(5, "Password minimal 5 characters")
        .max(100, "Maximum 100 characters")
        .required("Password required"),
    }),
    onSubmit: (values) => {
      loginProcess(values);
    },
  });

  const loginProcess = (values) => {
    if (!isAuthenticating) {
      setIsAuthenticating(true);
      const callreg = axios.post(
        `${API.HOST}/api/v2/auth/signin`,
        {
          email: values.email,
          password: values.password,
        },
        { timeout: 1000 * 45 }
      );

      toast.promise(
        callreg,
        {
          loading: "Mohon tunggu...",
          success: (data) => {
            setIsAuthenticating(false);
            dispatch(login(data.data.payload));

            if (data && data.data.success) {
              if (data.data.authorize === "mahasiswa") {
                props.history.push("/home");
              } else if (data.data.authorize === "dosen") {
                props.history.push("/dosen");
              } else if (data.data.authorize === "admin") {
                props.history.push("/admin");
              }
            }

            return data.data.success ? (
              <div className="relative">
                <span className="absolute inset-y-0 -left-5 flex items-center">
                  ✅
                </span>
                <p className="pl-3">{data.data.message}</p>
              </div>
            ) : (
              <div className="relative">
                <span className="absolute inset-y-0 -left-5 flex items-center">
                  ❌
                </span>
                <p className="pl-3">{data.data.message}</p>
              </div>
            );
          },
          error: (error) => {
            setIsAuthenticating(false);
            if (error.code === "ECONNABORTED") {
              return <b>Periksa koneksi anda dan ulangi beberapa saat lagi.</b>;
            } else {
              return <b>{error.response.data.message}</b>;
            }
          },
        },
        {
          style: {
            minWidth: "250px",
            border: "1px solid #1E40AF",
            padding: "16px",
            color: "#1E40AF",
            marginBottom: "25px",
          },
          success: {
            duration: 4500,
            icon: "",
          },
        }
      );
    }
  };

  if (user.isAuth) {
    if (user.value.authorize === "mahasiswa") {
      return <Redirect to="/home" />;
    } else if (user.value.authorize === "dosen") {
      return <Redirect to="/dosen" />;
    } else if (user.value.authorize === "admin") {
      return <Redirect to="/admin" />;
    }
  }

  return (
    <>
      <Helmet>
        <title>Login - e-TAXZONE POLINEMA</title>
      </Helmet>
      <PortalLayout>
        {/* Main Container */}
        <div className="flex-1 flex flex-col align-middle items-center justify-center p-8">
          <h1 className="text-2xl font-bold text-blue-800 mb-2 mt-8">
            e-<span className="text-blue-800">TAXZONE</span> <span className="text-yellow-500">POLINEMA</span>
          </h1>
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden flex">
            {/* Left Side - Login Form */}
            <div className="w-1/2 p-12 relative">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8">Login</h2>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* User ID Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="medium"
                    placeholder="NIM/NIP/NIPPK-Special Identity for E-AP and Financial"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '14px',
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                        },
                      },
                    }}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="medium"
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter your User ID Password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPwd(!showPwd)}
                            edge="end"
                          >
                            {showPwd ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '14px',
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                        },
                      },
                    }}
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-left">
                  <span className="text-sm text-gray-600">
                    Lupa kata sandi? Silakan hubungi admin.
                  </span>
                </div>

                {/* Login Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isAuthenticating}
                    endIcon={
                      isAuthenticating ? (
                        <CircularProgress
                          size={20}
                          thickness={4}
                          style={{ color: "white" }}
                        />
                      ) : null
                    }
                    sx={{
                      backgroundColor: '#f59e0b',
                      '&:hover': {
                        backgroundColor: '#d97706',
                      },
                      '&:disabled': {
                        backgroundColor: '#fde68a',
                      },
                      fontWeight: '600',
                      textTransform: 'none',
                      fontSize: '16px',
                      padding: '14px 0',
                      borderRadius: '6px',
                    }}
                  >
                    Login
                  </Button>
                </div>

                {/* Register Links */}
                <div className="text-center space-y-2 pt-4">
                  <div className="text-sm text-gray-600">
                    New User?{' '}
                    <NavLink
                      to="/register"
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Register here
                    </NavLink>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Side - Background Image */}
            <div
              className="w-1/2 bg-cover bg-[#222C5F] bg-no-repeat"
              style={{
                backgroundImage: `url(${RightPanelLogin})`,
              }}
            ></div>
          </div>
        </div>
      </PortalLayout>
    </>
  );
}

export default Login;