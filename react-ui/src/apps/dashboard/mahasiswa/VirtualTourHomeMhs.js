import React from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ShimmerListVTCourse from "../component/ShimmerListVTCourse";
import ListVTCourse from "./ListVTCourse";
import { Grid } from "@mui/material";
import useSWR from "swr";

export default function VirtualTourHomeMhs() {
  const { code } = useParams();
  const statescen = useSelector((state) => state.scen);
  // }, [code, state]);
  const { data } = useSWR(
    code !== "-"
      ? `${API.HOST}/api/v2/course/${code}/virtualtourdatalist?${statescen.selectedcode}`
      : null,
    (url) =>
      axios(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((data) => data.data)
        .catch((error) => {
          toast.error(error.response.data.message, {
            style: {
              minWidth: "250px",
              border: "1px solid #FF4C4D",
              padding: "16px",
              color: "#000",
              marginBottom: "25px",
            },
            duration: 5000,
          });
        }),
    {
      refreshWhenOffline: true,
      loadingTimeout: 6000, //slow network (2G, <= 70Kbps) default 3s
      onLoadingSlow: () =>
        toast("Koneksi Anda Buruk", {
          icon: "⚠️",
          style: {
            minWidth: "250px",
            border: "1px solid #FF4C4D",
            padding: "16px",
            color: "#000",
            marginBottom: "25px",
          },
          duration: 5000,
        }),
      onSuccess: (data) => { 
        if (!data.success) {
          toast.error(data.message, {
            style: {
              minWidth: "250px",
              border: "1px solid #FF4C4D",
              padding: "16px",
              color: "#000",
              marginBottom: "25px",
            },
            duration: 5000,
          });
        }
      },
      onError: (err) => {
        toast.error(err.response.data.message, {
          style: {
            minWidth: "250px",
            border: "1px solid #FF4C4D",
            padding: "16px",
            color: "#000",
            marginBottom: "25px",
          },
          duration: 5000,
        });
      },
    }
  );

  return (
    <div>
      <Helmet>
        <title>Virtual Tour Kelas {statescen.nama}</title>
      </Helmet>
      {statescen.selectedcode === "-" ? (
        <Grid item xs={12} md={12} lg={12}>
          <div className="my-5 p-5 h-32 bg-white text-center text-xl">
            Pilih Kelas Terlebih dahulu.
          </div>
        </Grid>
      ) : data ? (
        data.data && data.data.length !== 0 ? (
          <ListVTCourse data={data.data} />
        ) : (
          <div className="message text-center flex justify-center items-center min-h-25v">
            {data.message}
          </div>
        )
      ) : (
        <ShimmerListVTCourse />
      )}
    </div>
  );
}
