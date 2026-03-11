import React, { useState } from "react";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import { Helmet } from "react-helmet";
import axios from "axios";
import useSWR from "swr";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Blog.css";
import { useParams } from "react-router-dom";
import API from "../../../../utils/host.config";
//component
import NavigasiTopManufaktur from "../../../virtualtour360/components/NavigasiTopManufaktur";
import toast from "react-hot-toast";
import { ShimmerSectionHeader, ShimmerTitle } from "react-shimmer-effects";

const BlogManufaktur = () => {
  const [isLoad, setIsLoad] = useState(true);
  let { title } = useParams();
  let type = "manufaktur";
  //#region

  const { data, error } = useSWR(
    `${API.HOST}/api/v2/admin/blog/detail/${type}/${title}`,
    (url) =>
      axios(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }).then((data) => data.data),
    {
      refreshWhenOffline: true,
      loadingTimeout: 60000, //default 3000ms
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
      onSuccess: (data) => {
        setIsLoad(false);
      },
    }
  );

  if (error) return "Failed to load...";

  const getTitle = (tit) => {
    var arr = tit.split("-");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
  };

  return (
    <>
      <Helmet>
        <title>{getTitle(title)} | Manufaktur Polinema</title>
      </Helmet>
      <NavigasiTopManufaktur />

      <Container maxWidth="md">
        {isLoad ? (
          <div className="relative pt-10">
            <ShimmerSectionHeader center />
            <ShimmerTitle line={5} variant="secondary" />
            <br />
            <ShimmerTitle line={8} variant="secondary" />
            <br />
            <ShimmerTitle line={8} variant="secondary" />
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <CircularProgress />
            </div>
          </div>
        ) : data && data.data ? (
          <Box>
            <div
              className={"min-h-3/4 mb-4x mt-10"}
              dangerouslySetInnerHTML={{ __html: data.data.content }}
            ></div>
          </Box>
        ) : (
          <Box
            style={{
              minHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Artikel tidak ditemukan.
            </Typography>
          </Box>
        )}
        <br/><br/><br/><br/><br/>
      </Container>
    </>
  );
};

export default BlogManufaktur;
