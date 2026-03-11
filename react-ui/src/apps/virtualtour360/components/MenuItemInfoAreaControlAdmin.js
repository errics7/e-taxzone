import { Button, FormControlLabel, Switch, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clean } from "../../../redux/configSlice";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import makeStyles from "@mui/styles/makeStyles";
import { find, findIndex, remove } from "lodash";
import ReactAudioPlayer from "react-audio-player";
import toast from "react-hot-toast";
import API from "../../../utils/host.config";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  sliderUpdate: {
    color: "#E6C12B",
  },
  sliderDef: {
    color: "#4050B5",
  },
}));

function MenuItemInfoAreaControlAdmin(props) {
  const classes = useStyles();
  const { dataInfo, setDataInfo } = props;
  const dispatch = useDispatch();
  const cfg = useSelector((state) => state.config);
  const data = find(dataInfo, { uid: cfg.data.uid });

  const filename = data?.url_audio.toString().split("/");

  const [load, setLoad] = useState(false);
  const [link, setLink] = useState(
    data?.to_link !== null && data?.to_link !== "" ? true : false
  );
  const [audio, setAudio] = useState(
    data?.url_audio !== null && data?.url_audio !== "" ? true : false
  );
  const [audioFile, setAudioFile] = useState(
    data?.url_audio !== null && data?.url_audio !== "" ? data?.url_audio : null
  );
  const [audioFilePreview, setAudioFilePreview] = useState(null);

  const removeInfo = () => {
    const list = [...dataInfo];
    remove(list, { uid: cfg.data.uid });
    setDataInfo(list);
  };

  const onChangeInfo = (e) => {
    const { name, value } = e.target;
    const list = [...dataInfo];
    const idx = findIndex(dataInfo, { uid: cfg.data.uid });
    list.splice(idx, 1, { ...list[idx], [name]: value });

    setDataInfo(list);
  };

  const prevValue = () => {
    const list = [...dataInfo];
    const idx = findIndex(dataInfo, { uid: cfg.data.uid });
    list.splice(idx, 1, {
      ...cfg.data.prev,
    });
    setDataInfo(list);
  };

  const setDefaultSrc = () => {
    const img = document.getElementById(cfg.data.uid);
    if (cfg.data.current.type === "itemInfoArea") {
      img.setAttribute("src", require("../assets/icon/infobasic.gif"));
    }
    if (cfg.data.current.type === "itemLinkArea") {
      img.setAttribute("src", require("../assets/icon/movee.gif"));
    }
    if (cfg.data.current.type === "itemLinkGS") {
      img.setAttribute("src", require("../assets/icon/itemgs.gif"));
    }
  };

  const fileChangeHandler = (event) => {
    if (event.target.files[0]) {
      const size_in_mb = event.target.files[0].size / (1024 * 1024);
      // console.log(size_in_mb);
      if (size_in_mb > 10) {
        toast.error(
          "Maksimu ukuran Audio 10MB, ukuran file kamu " +
            size_in_mb.toFixed(2) +
            " MB",
          {
            style: {
              minWidth: "250px",
              border: "1px solid #FF4C4D",
              padding: "16px",
              color: "#000",
              marginBottom: "25px",
            },
            error: {
              duration: 3500,
            },
          }
        );
        return;
      }
      setAudioFile(event.target.files[0]);
      let reader = new FileReader();
      reader.onloadend = () => {
        setAudioFilePreview(reader.result);
      };
      reader.readAsDataURL(event.target.files[0]);

      // Clean Url Audio
      const list = [...dataInfo];
      const idx = findIndex(dataInfo, { uid: cfg.data.uid });
      list.splice(idx, 1, {
        ...list[idx],
        url_audio: "",
      });
      setDataInfo(list);
    }
  };

  const createProcess = () => {
    const formData = new FormData();
    formData.append("audio", audioFile);

    setLoad(true);
    let barx = 0;
    const callupload = axios.post(
      `${API.HOST}/api/v2/virtualtour/area/uploadaudio`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar
          let bar = document.getElementById("bar");
          barx = Math.round((100 * data.loaded) / data.total);
          bar.style.width = barx + "%";
        },
      }
    );
    toast.promise(
      callupload,
      {
        loading: "Proses menyimpan audio ...",
        success: (data) => {
          setLoad(false);
          if (data.data.success) {
            // console.log(data.data.data.file_url);

            //setName UrL
            const list = [...dataInfo];
            const idx = findIndex(dataInfo, { uid: cfg.data.uid });
            list.splice(idx, 1, {
              ...list[idx],
              url_audio: data.data.data.file_url,
            });
            setDataInfo(list);
            //
            setDefaultSrc();
            dispatch(clean());
            // OK
          }
          return data.data.success ? (
            <div className="relative">
              <span className="absolute inset-y-0 -left-5 flex items-center">
                ✅
              </span>
              <p className="pl-3">{data.data.message}</p>
            </div>
          ) : (
            <div className="relative">
              <span className="absolute inset-y-0 -left-5 flex items-center">
                ❌
              </span>
              <p className="pl-3">{data.data.message}</p>
            </div>
          );
          // message
        },
        error: (error) => {
          setLoad(false);
          console.log(error);

          return (
            <div className="relative">
              <span className="absolute inset-y-0 -left-5 flex items-center">
                ❌
              </span>
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
          marginBottom: "25px",
        },
        success: {
          duration: 3000,
          icon: "",
        },
        error: {
          duration: 4500,
          icon: "",
        },
      }
    );
  };

  return (
    <div className="w-full min-h-30v relative rounded overflow-hidden z-50 bg-slate-50 text-slate-600">
      <h1 className="text-left p-3 pt-5 pl-6 font-bold border-b">
        Detail Item Informasi
      </h1>
      <div className="mx-3 flex flex-col space-y-3 pt-3 max-h-40v overflow-y-scroll pb-24">
        <TextField
          label="Nama Informasi"
          variant="outlined"
          fullWidth
          name="name"
          placeholder="isi Nama Informasi"
          style={{ width: "50%" }}
          value={data ? data.name : ""}
          onChange={(e) => onChangeInfo(e)}
        />
        <TextField
          label="Description"
          placeholder="isi Deskripsi Informasi"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          name="deskripsi"
          value={data ? data.deskripsi : ""}
          onChange={(e) => onChangeInfo(e)}
        />
        <div className="mx-1 -mt-8">
          <p>
            Audio File : (
            {audio
              ? audioFile?.name
                ? audioFile?.name
                : filename[filename.length - 1]
              : "-"}
            )
          </p>
          <div className="flex flex-row justify-between items-center">
            <div className="grow flex items-center space-x-2">
              <FormControlLabel
                control={
                  <Switch
                    checked={audio}
                    onChange={() => setAudio(!audio)}
                    name="audio"
                  />
                }
                label={audio ? "Aktif" : "Non Aktif"}
              />
              {!audioFile?.name && !filename[filename.length - 1] ? (
                <button
                  onClick={() => {
                    if (audio) {
                      const hidden = document.getElementById("inputaudioadmin");
                      hidden.click();
                    }
                  }}
                  className={`bg-blue-400 hover:bg-blue-500 rounded text-white font-bold py-2 px-2 inline-flex items-center ${
                    !audio && " cursor-not-allowed"
                  }`}
                >
                  <svg
                    fill="#FFF"
                    height="18"
                    viewBox="0 0 24 24"
                    width="18"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                  </svg>
                  <span className="pl-2 text-sm truncate max-w-20v">
                    Upload Audio
                  </span>
                </button>
              ) : (
                <div className="block">
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    size="small"
                    onClick={() => {
                      //setName UrL
                      const list = [...dataInfo];
                      const idx = findIndex(dataInfo, { uid: cfg.data.uid });
                      list.splice(idx, 1, {
                        ...list[idx],
                        url_audio: "",
                      });
                      setDataInfo(list);
                      //
                      setAudioFile(null);
                      setAudioFilePreview(null);
                    }}
                  >
                    Hapus audio
                  </Button>
                </div>
              )}
              <input
                type="file"
                id="inputaudioadmin"
                className={`hidden`}
                onChange={(event) => fileChangeHandler(event)}
                disabled={!audio}
                accept=".mp3,.m4a,.aac"
                title="your text"
              />
            </div>
            {audio && (
              <ReactAudioPlayer
                src={
                  audio && data?.url_audio !== ""
                    ? API.HOST + "/" + data?.url_audio
                    : audioFilePreview
                }
                controls
                className={`flex-none`}
              />
            )}
          </div>
        </div>
        <div className="mx-1 -mt-8">
          <p>Link Eksternal : </p>
          <div className="flex mt-3">
            <FormControlLabel
              control={
                <Switch
                  checked={link}
                  onChange={() => {
                    setLink(!link);
                    //setName to_link
                    const list = [...dataInfo];
                    const idx = findIndex(dataInfo, { uid: cfg.data.uid });
                    list.splice(idx, 1, {
                      ...list[idx],
                      to_link: "",
                    });
                    setDataInfo(list);
                  }}
                  name="link"
                />
              }
              label={link ? "Aktif" : "Non Aktif"}
            />
            <TextField
              label="link External"
              placeholder="Masukkan link External contoh: https://www.youtube.com"
              multiline
              rows={1}
              variant="outlined"
              fullWidth
              name="to_link"
              value={!link ? "" : data ? data.to_link : ""}
              onChange={(e) => onChangeInfo(e)}
              InputLabelProps={{ shrink: true }}
              disabled={!link}
            />
          </div>
        </div>
        {load ? (
          <div className="my-2 h-3 relative w-full rounded-full overflow-hidden">
            <div className="w-full h-full bg-slate-200 absolute"></div>
            <div id="bar" className="h-full bg-emerald-500 relative w-0"></div>
          </div>
        ) : null}
      </div>
      {/*footer*/}
      <div className="absolute bottom-0 w-full z-50 bg-white flex justify-end md:flex-row items-center px-6 py-4 border-t border-solid border-blueslate-200 rounded-b">
        <div className="flex space-x-5">
          <Button
            variant="outlined"
            color="error"
            size="medium"
            className={classes.button}
            startIcon={<DeleteForeverIcon />}
            onClick={() => {
              setDefaultSrc();
              removeInfo();
              dispatch(clean());
            }}
            disabled={load}
          >
            Hapus
          </Button>
          <Button
            variant="outlined"
            // color="error"Î
            size="medium"
            className={classes.button}
            startIcon={<ManageHistoryIcon />}
            onClick={() => {
              setDefaultSrc();
              prevValue();
              dispatch(clean());
            }}
            disabled={load}
          >
            Batalkan Perubahan
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            className={classes.button}
            onClick={() => {
              if (audio && data?.url_audio === "") {
                createProcess();
              } else {
                setDefaultSrc();
                dispatch(clean());
              }
            }}
            disabled={load}
          >
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemInfoAreaControlAdmin;
