import React, { useState } from "react";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";

import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { useDispatch } from "react-redux";
import { refresh } from "../../../redux/counterSlice";

function CardUpdateWorksheet(props) {
  const dispatch = useDispatch();
  const [data, setdata] = useState(props.dataa);
  const [imagemode, setimagemode] = useState("");
  const [fileImage, setfileImage] = useState(props.url);
  const [imagefilename, setimagefilename] = useState("");
  const [progress, setprogress] = useState(false); 

  const fileChangeHandler = (event) => {
    if (event.target.files[0]) {
      setfileImage(event.target.files[0]);
      setimagefilename(event.target.files[0].name);
      setimagemode("upload");
      //set mode image file need to upload

      let reader = new FileReader();
      reader.onloadend = () => {
        setdata({
          ...data,
          img_path: reader.result,
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const processToUpdate = () => {
    if (progress) return;
    setprogress(true);

    if (imagemode === "url") {
      toast.promise(
        updatetodb(data.img_path),
        {
          loading: "upload image...",
          success: (data) => {
            setprogress(false);
            props.closeui();
            dispatch(refresh());
            return data.data.message;
          },
          error: (error) => {
            // if (!error.response.data.auth) dispatch({ type: "LOGOUT" });
            return <b>{error.response.data.message}</b>;
          },
        },
        {
          style: {
            minWidth: "250px",
            border: "1px solid #1E40AF",
            padding: "16px",
            color: "#1E40AF",
            marginBottom: "25px",
          },
          success: {
            duration: 5000,
          },
        }
      );
    } else if (imagemode === "upload") {
      // proses to save cloudinary
      var imgurl = "";
      const formData = new FormData();
      formData.append("photo", fileImage);
      const updateimg = axios.post(
        `${API.HOST}/api/v2/upload/img/gsicon`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        }
      );
      toast.promise(
        updateimg,
        {
          loading: "Udating data image...",
          success: (data) => {
            imgurl = API.HOST + "/" + data.data.file.path;
            return "Udating success";
          },
          error: (error) => {
            return (
              <div className="relative">
                <span className="absolute inset-y-0 -left-5 flex items-center"></span>
                <p className="pl-3">
                  <b>{error.response.data.message}</b>
                </p>
              </div>
            );
          },
        },
        {
          style: {
            minWidth: "250px",
            border: "1px solid #1E40AF",
            padding: "16px",
            color: "#1E40AF",
          },
          success: {
            duration: 5000,
          },
        }
      );
      updateimg.then(() => {
        toast.promise(
          updatetodb(imgurl),
          {
            loading: "Saving Data...",
            success: (data) => {
              setprogress(false);
              props.closeui();
              dispatch(refresh());
              return data.data.message;
            },
            error: (error) => {
              // if (!error.response.data.auth) dispatch({ type: "LOGOUT" });
              return <b>{error.response.data.message}</b>;
            },
          },
          {
            style: {
              minWidth: "250px",
              border: "1px solid #1E40AF",
              padding: "16px",
              color: "#1E40AF",
            },
            success: {
              duration: 5000,
            },
          }
        );
      });
    } else {
      toast.promise(
        updatetodb(data.img_path),
        {
          loading: "Saving Data...",
          success: (data) => {
            setprogress(false);
            props.closeui();
            dispatch(refresh());
            return data.data.message;
          },
          error: (error) => {
            console.log(error);
            // if (!error.response.data.auth) dispatch({ type: "LOGOUT" });
            return <b>{error.response.data.message}</b>;
          },
        },
        {
          style: {
            minWidth: "250px",
            border: "1px solid #1E40AF",
            padding: "16px",
            color: "#1E40AF",
          },
          success: {
            duration: 5000,
          },
        }
      );
    }
  };

  const updatetodb = (url) => {
    // saving  data on db
    return axios.post(
      `${API.HOST}/api/v2/skenario/gsworksheet/updateimage`,
      {
        title: data.title,
        deskripsi: data.deskripsi,
        img_path: url,
        gs: data.gs,
        id: data.idws,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={props.isshow}
      aria-labelledby="max-width-dialog-title"
    >
      {/* Header */}
      <div className="flex justify-between mx-5 my-1">
        <div className="place-self-center text-2xl font-semibold">
          Edit GS Icon
        </div>
        <div className="">
          <IconButton
            aria-label="delete"
            className="focus:outline-none border bg-white"
            onClick={() => props.closeui()}
            size="large"
          >
            <CloseIcon className="text-red-500" />
          </IconButton>
        </div>
      </div>
      <hr />
      {/* isi */}
      <div className="grid grid-cols-2 gap-0 content-around">
        <div className="container my-5 w-72 mx-auto">
          <div className="bg-white h-full rounded shadow-md border flex flex-col hover:shadow-lg">
            <div className="flex items-end flex-col grow pb-0 relative">
              <div className="h-32 w-full relative group">
                <div
                  className="bg-cover bg-center h-32 w-full px-5 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${data.img_path})`,
                    border: "inset 20px transparent",
                  }}
                ></div>
                <input
                  id="hidden-input"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={fileChangeHandler}
                />
                <span className="absolute left-0 top-0 m-1 opacity-0 group-hover:bg-opacity-60 group-hover:opacity-100 text-xxxs text-white z-50">
                  File : {imagefilename === "" ? data.img_path : imagefilename}
                </span>
                <div className="absolute bg-black rounded opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex flex-col items-center group-hover:opacity-100 transition justify-center">
                  <button
                    onClick={() => {
                      const hidden = document.getElementById("hidden-input");
                      hidden.click();
                    }}
                    className="border-2 border-blue-500 rounded-lg font-bold text-blue-500 px-4 py-3 duration-300 ease-in-out hover:bg-blue-500 hover:text-white opacity-0 transform focus:outline-none hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100 transition"
                  >
                    <span className="text-md leading-normal font-bold text-xs">
                      Select file to Upload
                    </span>
                  </button>
                </div>
              </div>
              <div className="px-2 flex-col w-full pb-3 bg-slate-100">
                <div className="text-xl relative pt-1 truncate">
                  {data.title}
                </div>
                <p className="pl-0.5 truncate">{data.deskripsi}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-1">
          <p className="font-semibold">Editor :</p>
          <div className="my-3 w-full pr-8">
            <TextField
              label="Title"
              fullWidth
              value={data.title}
              variant="outlined"
              onChange={(x) => setdata({ ...data, title: x.target.value })}
            />
          </div>
          <div className="my-3 w-full pr-8">
            <TextField
              label="Deskripsi"
              fullWidth
              value={data.deskripsi}
              multiline
              rows={4}
              variant="outlined"
              onChange={(x) => setdata({ ...data, deskripsi: x.target.value })}
            />
          </div>
        </div>
      </div>
      {/* isi */}
      <hr />
      <div className="flex flex-row">
        <div className="relative mx-5">
          <button
            onClick={() => {
              processToUpdate();
            }}
            disabled={progress ? true : false}
            className={`bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded my-3 ${
              progress ? "cursor-not-allowed" : ""
            }`}
          >
            <SaveIcon className="px-1 -mt-1" />
            Update
          </button>
          <button
            onClick={() => props.closeui()}
            disabled={progress ? true : false}
            className={`bg-transparent border-2 border-red-300 text-red-500 hover:bg-red-500 hover:text-slate-100 hover:border-red-500 focus:border-4 focus:border-red-300 px-4 py-1.5 ml-5 rounded my-3 ${
              progress ? "cursor-not-allowed" : ""
            }`}
          >
            <CloseIcon className="px-0.5 -mt-1 pt-1" />
            Batal
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default CardUpdateWorksheet;
