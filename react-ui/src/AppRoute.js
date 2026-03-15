import React, { lazy, Suspense, useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { ProtectedRoute } from "./utils/Protected.route";
import toast, { Toaster } from "react-hot-toast";
import { MODE } from "./utils/host.config";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { logout, sett } from "./redux/userSlice";

// Routes
import ThemeConfig from "./theme";
import DashboardLayout from "./apps/dashboard/layout";
const Login = lazy(() => import("./apps/dashboard/pages/Login"));
const Register = lazy(() => import("./apps/dashboard/pages/RegisterAccount/RegisterAccount"));

const Home = lazy(() => import("./apps/dashboard/pages/Home"));
const BlogPerdagangan = lazy(() => import("./apps/dashboard/pages/blogs/BlogPerdagangan"));
const BlogManufaktur = lazy(() => import("./apps/dashboard/pages/blogs/BlogManufaktur"));
const NotFound = lazy(() => import("./apps/dashboard/pages/NotFound"));
const DashboardRoutesMhs = lazy(() => import("./apps/dashboard/DashboardRoutesMhs"));
const DashboardRoutesAdmin = lazy(() => import("./apps/dashboard/DashboardRoutesAdmin"));
const DashboardRoutesDosen = lazy(() => import("./apps/dashboard/DashboardRoutesDosen"));
const VirtualTourRoutes = lazy(() => import("./apps/virtualtour360/VirtualTourRoutes"));

function AppRoute() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // console.log("check expiry");
    if (localStorage.getItem("xtoken")) {
      try {
        const data = jwt_decode(localStorage.getItem("xtoken"));
        if (data) {
          //JWT check if token expired
          if (data.exp * 1000 < Date.now()) {
            toast.error("Sesi telah berakhir.", {
              style: {
                minWidth: "250px",
                border: "1px solid #FF4C4D",
                padding: "16px",
                color: "#000",
                marginBottom: "25px",
              },
              duration: 5000,
              icon: "⚠️",
            });
            dispatch(logout());
          } else {
            // console.log("Noo expiry");
            if (!user.isAuth) {
              dispatch(sett(data));
            }
          }
        }
      } catch (err) {
        console.log(err);
        dispatch(logout());
      }
    }
  });

  return (
    <ThemeConfig>
      <Suspense fallback={<div className="text-center">Memuat...</div>}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/b/:title" component={MODE === "perdagangan" ? BlogPerdagangan : BlogManufaktur} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          <Route path="/dasboard" component={DashboardLayout} />
          <ProtectedRoute allowed={["mahasiswa", "admin"]} path="/home" component={DashboardRoutesMhs} />
          <ProtectedRoute allowed={["dosen"]} path="/dosen" component={DashboardRoutesDosen} />
          <ProtectedRoute allowed={["admin"]} path="/admin" component={DashboardRoutesAdmin} />
          <Route path="/virtualtour" component={VirtualTourRoutes} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Suspense>
      <Toaster position="bottom-center" reverseOrder={false} />
    </ThemeConfig>
  );
}

export default withRouter(AppRoute);