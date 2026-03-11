import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import toast from "react-hot-toast";
import API from "../../../../utils/host.config";
import moment from "moment";
import idLocale from "moment/locale/id";
import { ShimmerTable } from "react-shimmer-effects";
import { Helmet } from "react-helmet";

const BlogAdminManufaktur = () => {
  const type = "manufaktur";
  const { data, error } = useSWR(
    `${API.HOST}/api/v2/admin/blog/${type}`,
    (url) =>
      axios(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }).then((data) => data.data),
    {
      refreshWhenOffline: true,
      loadingTimeout: 45000, //default 3000ms
      onLoadingSlow: () =>
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
        }),
    }
  );

  if (error) return "Failed to load...";

  return (
    <div>
      <Helmet>
        <title>Pengaturan Blog Manufaktur | Admin</title>
      </Helmet>
      <p className="text-2xl mb-3">Data Halaman</p>
      <div className="overflow-x-auto border-collapse border">
        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-bold bg-slate-50 text-slate-600 border border-slate-300  px-6 py-4 text-left"
              >
                Halaman Manufaktur
              </th>
              <th
                scope="col"
                className="text-sm font-bold bg-slate-50 text-slate-600 border border-slate-300 px-6 py-4 text-left"
              >
                Penulis
              </th>
              <th
                scope="col"
                className="text-sm font-bold bg-slate-50 text-slate-600 border border-slate-300 px-6 py-4 text-left"
              >
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((el, index) => (
              <tr
                key={index}
                className="bg-white border-t border-slate-300 lg:hover:bg-slate-100"
              >
                <td className="capitalize text-sm text-blue-600 visited:text-purple-600 font-light whitespace-nowrap px-6 py-4">
                  <Link to={`/admin/blog/${type}/${el.slug}`}>{el.slug}</Link>
                </td>
                <td className="capitalize text-sm text-gray-900 font-light whitespace-nowrap px-6 py-4">
                  {el.nama}
                </td>
                <td className="text-sm text-gray-900 font-light whitespace-nowrap px-6 py-4">
                  {moment(el.updated_date)
                    .locale("id", idLocale)
                    .format("DD-MM-YYYY h:mm:ss")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data && (
          <>
            <ShimmerTable row={6} col={3} />
          </>
        )}
      </div>
    </div>
  );
};

export default BlogAdminManufaktur;
