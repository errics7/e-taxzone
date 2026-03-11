import React, { useState, Suspense, lazy } from "react";
import axios from "axios";
import API from "../../utils/host.config";
import { Route, Switch, Redirect } from "react-router-dom";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import DashboardNavbar from "./layout/DashboardNavbar";
import DashboardSidebar from "./layout/DashboardSidebar";
import { useSelector } from "react-redux";
import useSWR from 'swr';
import Navbar from "./layout/Navbar";
import { Box } from "@mui/material";

const MyAccount = lazy(() => import("./component/MyAccount"));
const FRouter = lazy(() => import("./mahasiswa/FRouter"));
const HomeMhs = lazy(() => import("./mahasiswa/HomeMhs"));
const KodeOtorisasi = lazy(() => import("./mahasiswa/DJPAuthorization"));
const SPTTahunan = lazy(() => import("./mahasiswa/SPT/ListSptTahunanOrangPribadi"));
const SPTOrangPribadi = lazy(() => import("./mahasiswa/SPT/SptTahunanOrangPribadi"));
const SptTahunanBadanForm = lazy(() => import("./mahasiswa/SPT/SptTahunanBadan"));


// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
  background: '#fff',
  // display: "flex",
  minHeight: "100vh",
  // overflow: "hidden",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  // overflow: "auto",
  minHeight: "100%",
  margin: "0 auto", // center the content
  // maxWidth: "1100px",
  // },
}));

//#endregion

export default function DashboardRoutesMhs() {
  // const [dataKelas, setDataKelas] = useState(null);
  const refresh = useSelector((state) => state.counter.value);

  const { data: dataKelas } = useSWR(`${API.HOST}/api/v2/course/list?${refresh}`, (url) => axios(url, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("xtoken"),
    },
  })
    .then(data => {
      return data.data;
    })
    .catch(error => {
      if (error.response.status === 401) {
        toast.error(error.response.data.message, {
          style: {
            minWidth: "250px",
            border: "1px solid #FF4C4D",
            padding: "16px",
            color: "#000",
            marginBottom: "25px",
          },
          success: {
            duration: 5000,
          },
        });
      }
    }), {
    refreshWhenOffline: true,
    loadingTimeout: 6000, //slow network (2G, <= 70Kbps) default 3s
    onLoadingSlow: () => toast('Koneksi Anda Buruk', {
      icon: '⚠️',
      style: {
        minWidth: "250px",
        border: "1px solid #FF4C4D",
        padding: "16px",
        color: "#000",
        marginBottom: "25px",
      },
    }),
    onError: (err) => {
      toast.error(err.response.data.message, {
        style: {
          minWidth: "250px",
          border: "1px solid #FF4C4D",
          padding: "16px",
          color: "#000",
          marginBottom: "25px",
        },
        success: {
          duration: 5000,
        },
      });
    },
  });

  return (
    <RootStyle>
      <Navbar />
      <MainStyle>
        <Suspense fallback={<div className="text-center">Memuat...</div>}>
          <Box sx={{ paddingTop: 10 }} />
          <Switch>
            <Route exact path="/home" component={HomeMhs} />
            <Route exact path="/home/kode-otorisasi" component={KodeOtorisasi} />
            <Route exact path="/home/spt-tahunan" component={SPTTahunan} />
            <Route exact path="/home/spt-tahunan-orang-pribadi" component={SPTOrangPribadi} />
            <Route exact path="/home/spt-tahunan-badan" component={SptTahunanBadanForm} />

            <Route path="/home/setting" component={MyAccount} />
            <Route path="/home/" render={(props) => <FRouter {...props} dataKelas={dataKelas} />} />
            <Route path="*" render={() => <Redirect to="/home" />} />
          </Switch>
        </Suspense>
      </MainStyle>
    </RootStyle>
  );
}