import React from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import useSWR from "swr";
import HariIni from "../component/HariIni";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { ShimmerTable } from "react-shimmer-effects";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 0,
    marginBottom: 0,
  },
  icon: {
    fontSize: 50,
    color: "white",
  },
  statCard: {
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'rgba(255,255,255,0.1)',
      transform: 'rotate(45deg)',
      zIndex: 1,
      transition: 'all 0.3s ease',
    },
    '&:hover::before': {
      transform: 'rotate(45deg) translate(50%, 50%)',
    },
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    }
  }
}));

function HomeDosen(props) {
  const classes = useStyles();
  const user = useSelector((state) => state.user.value);
  const authorize = user.authorize;
  const { data, error } = useSWR(
    `${API.HOST}/api/v2/dosendasboard/main/summary`,
    (url) =>
      axios(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }).then((data) => {
        return data.data;
      }),
    {
      refreshWhenOffline: true,
      loadingTimeout: 60000,
      onLoadingSlow: () => {
        toast.error("Koneksi Anda Buruk", {
          style: {
            minWidth: "250px",
            border: "1px solid #FF4C4D",
            padding: "16px",
            color: "#000",
            marginBottom: "25px",
          },
          duration: 3500,
          icon: "⚠️",
        });
      },
      onSuccess: (data) => { },
    }
  );

  if (error) {
    swal({
      title: "Peringatan",
      text: error.response.data.message,
      icon: "error",
      closeOnClickOutside: false,
      buttons: {
        catch: {
          text: "Tutup",
          value: "oke",
          className: "mx-auto",
        },
      },
    }).then((value) => {
      switch (value) {
        case "oke":
          window.location.reload();
          break;
        default:
          return;
      }
    });
  }

  return (
    <div >
      <Helmet>
        <title>
          Dasboard | {authorize.charAt(0).toUpperCase() + authorize.slice(1)}
        </title>
      </Helmet>

      <div className="container mx-auto p-6 bg-white rounded-2xl">
        {/* Header */}
        <div className="">
          <h1 className="font-semibold">Halo selamat datang kembali, {user.nama}</h1>
          <HariIni />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-5">
          {/* Total Students */}
          <div className={`${classes.statCard} bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6 relative`}>
            <div className="flex items-center justify-between z-10 relative">
              <div className="bg-white/20 p-4 rounded-full">
                <SupervisorAccountIcon className={classes.icon} />
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80 mb-2">Total Mahasiswa</p>
                <p className="text-4xl font-bold">
                  {data && data?.count ? (
                    data.count[0].student_all
                  ) : (
                    <span className="bg-white/30 animate-pulse rounded">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Link to="/dosen/user" className="block mt-4 text-right text-white/80 hover:text-white z-10 relative">
              Lihat Detail →
            </Link>
          </div>

          {/* Active Students */}
          <div className={`${classes.statCard} bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg p-6 relative`}>
            <div className="flex items-center justify-between z-10 relative">
              <div className="bg-white/20 p-4 rounded-full">
                <SupervisorAccountIcon className={classes.icon} />
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80 mb-2">Mahasiswa Aktif</p>
                <p className="text-4xl font-bold">
                  {data && data.count ? (
                    data.count[0].student_aktif
                  ) : (
                    <span className="bg-white/30 animate-pulse rounded">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Link to="/dosen/user" className="block mt-4 text-right text-white/80 hover:text-white z-10 relative">
              Lihat Detail →
            </Link>
          </div>

          {/* Inactive Students */}
          <div className={`${classes.statCard} bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-lg p-6 relative`}>
            <div className="flex items-center justify-between z-10 relative">
              <div className="bg-white/20 p-4 rounded-full">
                <SupervisorAccountIcon className={classes.icon} />
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80 mb-2">Mahasiswa Belum Aktif</p>
                <p className="text-4xl font-bold">
                  {data && data.count ? (
                    data.count[0].student_non
                  ) : (
                    <span className="bg-white/30 animate-pulse rounded">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Link to="/dosen/user" className="block mt-4 text-right text-white/80 hover:text-white z-10 relative">
              Lihat Detail →
            </Link>
          </div>
        </div>

        {/* Login History */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 p-5 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Riwayat Login Mahasiswa
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="p-4 text-left border-b">Nama</th>
                  <th className="p-4 text-left border-b">NIM</th>
                  <th className="p-4 text-left border-b">Terakhir Login</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.user &&
                  data.user.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="p-4 border-b">{row.nama}</td>
                      <td className="p-4 border-b">{row.nim}</td>
                      <td className="p-4 border-b">{row.lasttime}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!data && <ShimmerTable row={3} col={3} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeDosen;