//#region
import React, { useState, Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { styled } from "@mui/material/styles";

import DashboardNavbar from "./layout/DashboardNavbar";
import DashboardSidebar from "./layout/DashboardSidebar";

const MyAccount = lazy(() => import("./component/MyAccount"));
const HomeDosen = lazy(() => import("./dosen/HomeDosen"));
const SkenarioListDosen = lazy(() => import("./dosen/SkenarioListDosen"));
const ScRouter = lazy(() => import("./dosen/ScRouter"));
const UserManagerDosen = lazy(() => import("./dosen/UserManagerDosen"));
const QuestionnaireMhs = lazy(() => import("./dosen/QuestionnaireMhs"));
const MahasiswaScore = lazy(() => import("./dosen/MahasiswaScore"));

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

export default function DashboardRoutesDosen() {
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
            <Route exact path="/dosen" component={HomeDosen} />
            <Route path="/dosen/skenario" component={SkenarioListDosen} />
            <Route path="/dosen/sc" component={ScRouter} />
            <Route path="/dosen/questionnaire-mhs" component={QuestionnaireMhs} />
            <Route path="/dosen/hasil-mhs" component={MahasiswaScore} />

            <Route path="/dosen/setting" component={MyAccount} />
            <Route path="/dosen/user" component={UserManagerDosen} />
            <Route path="*" render={() => <Redirect to="/dosen" />} />
          </Switch>
        </Suspense>
      </MainStyle>
    </RootStyle>
  );
}
