//#region
import React, { useState, Suspense, lazy } from "react"; 
import { Route, Switch, Redirect } from "react-router-dom";
import { styled } from "@mui/material/styles";
import DashboardNavbar from "./layout/DashboardNavbar";
import DashboardSidebar from "./layout/DashboardSidebar"; 

const Search = lazy(() => import("./component/Search"));
const MyAccount = lazy(() => import("./component/MyAccount"));
const WorkSheetRoutes = lazy(() => import("./admin/worksheet/WorkSheetRoutes")); 
const UserManagerAdmin = lazy(() => import("./admin/users/UserManagerAdmin"));
const HomeAdmin = lazy(() => import("./admin/HomeAdmin"));
const FeedbackAdmin = lazy(() => import("./admin/feeedback"));


const BlogAdminPerdagangan = lazy(() => import("./admin/blog/BlogAdminPerdagangan"));
const BlogAdminManufaktur = lazy(() => import("./admin/blog/BlogAdminManufaktur"));
const BlogDetailAdmin = lazy(() => import("./admin/blog/BlogDetailAdmin"));
const SkenarioListAdmin = lazy(() => import("./admin/SkenarioListAdmin"));
const ScRouterAdmin = lazy(() => import("./admin/ScRouterAdmin"));

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

//#endregion

export default function DashboardRoutesAdmin() {
  const [open, setOpen] = useState(true);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />
      <MainStyle>
        {/* <Outlet /> */}
        <Suspense fallback={<div className="text-center">Memuat...</div>}>
          <Switch>
            <Route exact path="/admin" component={HomeAdmin} /> 
            <Route path="/admin/skenario" render={(props) => <SkenarioListAdmin {...props} />} />
            <Route path="/admin/sc" component={ScRouterAdmin} />
            <Route path="/admin/user" component={UserManagerAdmin} /> 
            <Route path="/admin/setting" component={MyAccount} />
            <Route path="/admin/worksheet" component={WorkSheetRoutes} />
            <Route path="/admin/feedback" component={FeedbackAdmin} />

            <Route exact path="/admin/blog/perdagangan" component={BlogAdminPerdagangan} />
            <Route exact path="/admin/blog/manufaktur" component={BlogAdminManufaktur} />
            <Route path="/admin/blog/:type/:title" component={BlogDetailAdmin} /> 
            <Route exact path="/admin/search" component={Search} /> 
            <Route path="*" render={() => <Redirect to="/admin" />} />
          </Switch>
        </Suspense>
      </MainStyle>
    </RootStyle>
  );
}
