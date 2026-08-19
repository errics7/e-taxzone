/**
 * react-ui/src/apps/dashboard/DashboardRoutesMhs.js
 *
 * REFACTOR NOTES:
 * - Tambah lazy import ListSptTahunanBadan
 * - Tambah route /home/spt-tahunan-badan-list → komponen badan terpisah
 * - Route /home/spt-tahunan tetap ada dan hanya untuk pribadi
 * - Tidak ada perubahan lain — backward compatible
 */

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

const MyAccount = lazy(() => import("./component/MyAccount"));
const FRouter = lazy(() => import("./mahasiswa/FRouter"));
const HomeMhs = lazy(() => import("./mahasiswa/HomeMhs"));
const KodeOtorisasi = lazy(() => import("./mahasiswa/DJPAuthorization"));

// SPT Orang Pribadi — list + wizard pribadi saja
const SPTTahunan = lazy(() => import("./mahasiswa/SPT/ListSptTahunanOrangPribadi"));

// SPT Badan — list + wizard badan saja (file baru terpisah)
const SPTBadanList = lazy(() => import("./mahasiswa/SPT/ListSptTahunanBadan"));

const SPTOrangPribadi = lazy(() => import("./mahasiswa/SPT/SptTahunanOrangPribadi"));
const SptTahunanBadanForm = lazy(() => import("./mahasiswa/SPT/SptTahunanBadan"));


// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
  background: '#fff',
  minHeight: "100vh",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  minHeight: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
}));

export default function DashboardRoutesMhs() {
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
    loadingTimeout: 6000,
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
          <Switch>
            <Route exact path="/home" component={HomeMhs} />
            <Route exact path="/home/kode-otorisasi" component={KodeOtorisasi} />

            {/* SPT Orang Pribadi — list + wizard pribadi */}
            <Route exact path="/home/spt-tahunan" component={SPTTahunan} />

            {/* SPT Badan — list + wizard badan (route baru, terpisah dari pribadi) */}
            <Route exact path="/home/spt-tahunan-badan-list" component={SPTBadanList} />

            {/* Form detail pribadi */}
            <Route exact path="/home/spt-tahunan-orang-pribadi" component={SPTOrangPribadi} />

            {/* Form detail badan */}
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