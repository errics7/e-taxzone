//#region
import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import axios from "axios";
import API from "../../../utils/host.config";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import useSWR from "swr";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import HariIni from "../component/HariIni";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 0,
    marginBottom: 0,
  },
  table: {
    maxWidth: 850,
  },
  icon: {
    fontSize: 70,
    color: "#000",
  },
  cardColor: {
    backgroundColor: "#fff",
  },
}));
//#endregion

export default function HomeAdmin() {
  const classes = useStyles();
  const user = useSelector((state) => state.user.value);
  const { data, error } = useSWR(
    `${API.HOST}/api/v2/admindasboard/main/summary`,
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
      loadingTimeout: 60000, //default 3000ms
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
      onSuccess: (data) => {},
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
    <>
      <Helmet>
        <title>Dashboard | Admin</title>
      </Helmet>
      <section className="text-slate-600 body-font">
        <div className="px-5 pb-5">
          <h1 className="font-semibold">Hi Welcome back, {user.nama}</h1>
          <HariIni />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-5 py-3">
          <div className="shadow-md w-full border-2 rounded-lg p-3 xl:p-6 md:p-5">
            <div className="grid grid-rows-3 grid-flow-col gap-4">
              <div className="row-span-3 ">
                <SupervisorAccountIcon className={classes.icon} />
              </div>
              <div className="col-span-2 text-right text-lg">Mahasiswa</div>
              <div
                className={`row-span-2 col-span-2 text-right text-3xl text-bold`}
              >
                {data && data?.count ? (
                  data.count[0].student_all
                ) : (
                  <span className="bg-slate-200 animate-pulse rounded">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                )}
              </div>
            </div>
            <div className="h-1 w-200 bg-current rounded"></div>
            <Link to="/admin/user">
              <div className="mt-2 cursor-pointer">show detail</div>
            </Link>
          </div>

          <div className="shadow-md w-full border-2 rounded-lg p-3 xl:p-6 md:p-5">
            <div className="grid grid-rows-3 grid-flow-col gap-4">
              <div className="row-span-3 ">
                <SupervisorAccountIcon className={classes.icon} />
              </div>
              <div className="col-span-2 text-right text-lg">Aktif</div>

              <div
                className={`row-span-2 col-span-2 text-right text-3xl text-bold`}
              >
                {data && data.count ? (
                  data.count[0].student_aktif
                ) : (
                  <span className="bg-slate-200 animate-pulse rounded">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                )}
              </div>
            </div>
            <div className="h-1 w-200 bg-current rounded"></div>
            <Link to="/admin/user">
              <div className="mt-2 cursor-pointer">show detail</div>
            </Link>
          </div>

          <div className="shadow-md w-full border-2 rounded-lg p-3 xl:p-6 md:p-5">
            <div className="grid grid-rows-3 grid-flow-col gap-4">
              <div className="row-span-3 ">
                <SupervisorAccountIcon className={classes.icon} />
              </div>
              <div className="col-span-2 text-right text-lg">Belum Aktif</div>
              <div
                className={`row-span-2 col-span-2 text-right text-3xl text-bold`}
              >
                {data && data.count ? (
                  data.count[0].student_non
                ) : (
                  <span className="bg-slate-200 animate-pulse rounded">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                )}
              </div>
            </div>
            <div className="h-1 w-200 bg-current rounded"></div>
            <Link to="/admin/user">
              <div className="mt-2 cursor-pointer">show detail</div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row px-5 space-y-3 lg:space-y-0 space-x-0 lg:space-x-2 items-start">
          <div className="border-2 bg-white rounded-lg shadow-md w-full min-h-30v px-3 py-2">
            <div className="py-3 text-xl font-bold">
              Riwayat Login Mahasiswa
            </div>
            <table className="text-sm border-collapse w-full min-w-full table-fixed mb-5">
              <thead>
                <tr className="font-bold">
                  <th className="min-w-7v max-w-7v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Name
                  </th>
                  <th className="min-w-7v max-w-7v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    NIM
                  </th>
                  <th className="min-w-7v max-w-7v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    last Login
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.user &&
                  data.user.map((row, index) => (
                    <tr key={index}>
                      <td className="p-2 border truncate">{row.nama}</td>
                      <td className="p-2 border">{row.nim}</td>
                      <td className="p-2 border">{row.lasttime}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!data && <ShimmerTable row={3} col={3} />}
          </div>
          <div className="border-2 bg-white rounded-lg shadow-md w-full min-h-30v px-3 py-2">
            <div className="py-3 text-xl font-bold">Login Report Dosen</div>
            <table className="text-sm border-collapse w-full min-w-full table-fixed">
              <thead>
                <tr>
                  <th className="min-w-7v max-w-7v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Name
                  </th>
                  <th className="min-w-7v max-w-7v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    NIP
                  </th>
                  <th className="min-w-7v max-w-7v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    last Login
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.admin &&
                  data.admin.map((roww, index) => (
                    <tr key={index}>
                      <td className="p-2 border truncate">{roww.nama}</td>
                      <td className="p-2 border">{roww.nim}</td>
                      <td className="p-2 border">{roww.lasttime}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!data && <ShimmerTable row={3} col={3} />}
          </div>
        </div>
      </section>
    </>
  );
}
