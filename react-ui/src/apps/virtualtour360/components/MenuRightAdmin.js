import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SaveIcon from "@mui/icons-material/Save";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Menu, MenuItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { clean } from "../../../redux/configSlice";
import { refresh } from "../../../redux/counterSlice";
import toast from "react-hot-toast";
import axios from "axios";
import API from "../../../utils/host.config";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

function MenuRightAdmin(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { camRef, dataArea, dataInfo, setDataInfo, mode } = props;
  const [load, setLoad] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const addItemsUi = (prm) => {
    dispatch(clean());
    const yaw = camRef.current.getViewer().getYaw();
    const pitch = camRef.current.getViewer().getPitch();

    const ddd = {
      uid: uuidv4(),
      type: prm,
      name: "",
      deskripsi: "",
      url_audio: "",
      to_id: 0,
      to_link: "",
      yaw: yaw,
      pitch: pitch,
    };
    setDataInfo([...dataInfo, ddd]);
  };

  const saveDataList = () => {
    setLoad(true);
    const callupload = axios.post(
      `${API.HOST}/api/v2/virtualtour/area/updateallitemdata`,
      {
        idarea: dataArea.id,
        gsvt_id: dataArea.gsvt_id,
        list_itemarea: JSON.stringify(dataInfo),
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    toast.promise(
      callupload,
      {
        loading: "Proses pembaruan data ...",
        success: (data) => {
          setLoad(false);
          if (data.data.success) {
            dispatch(refresh());
            dispatch(clean());
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

  const keluarVtConfig = () => {
    swal({
      title: "Peringatan",
      text: "Anda akan Keluar dari halaman konfigurasi ? ,pastikan untuk menyimpan konfigurasi sebelum keluar.",
      icon: "warning",
      closeOnClickOutside: false,
      buttons: {
        cancel: "Batal",
        okee: {
          text: "Keluar",
          value: "okee",
        },
      },
    }).then((value) => {
      switch (value) {
        case "okee":
          history.replace("/login");
          break;
        default:
          return;
      }
    });
  };

  return (
    <div className="absolute top-7 right-2 z-50">
      <div className="flex flex-row justify-around items-center shadow-2xl rounded-md bg-white p-2">
        <span
          className="flex items-center px-4 py-2 mx-3 text-sm rounded-md capitalize text-slate-700 hover:bg-emerald-100 group cursor-pointer flex-col"
          aria-controls="customized-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <AddToQueueIcon className="text-emerald-500 group-hover:scale-110" />
          <p>Tambah</p>
        </span>
        <span
          className="flex items-center px-4 py-2 mx-3 text-sm rounded-md capitalize text-slate-700 hover:bg-blue-100 group cursor-pointer flex-col"
          onClick={() => {
            if (load) return;
            saveDataList();
          }}
        >
          <SaveIcon className="text-blue-500 group-hover:scale-110" />
          <p>Simpan</p>
        </span>
        <span
          className="flex items-center px-4 py-2 mx-3 text-sm rounded-md capitalize text-slate-700 hover:bg-red-100 group cursor-pointer flex-col"
          onClick={() => {
            if (load) return;
            keluarVtConfig();
          }}
        >
          <ExitToAppIcon className="text-red-500 group-hover:scale-110" />
          <p>Keluar</p>
        </span>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 35,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        autoFocus={false}
      >
        <MenuItem
          onClick={() => {
            if (load) return;
            handleClose();
            // dispatch(setItemInfoArea({ x: 0, y: 0, z: 0 }));
            addItemsUi("itemInfoArea");
          }}
          sx={{
            fontSize: 14,
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "#e3f2fd",
            },
          }}
        >
          Item Informasi
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (load) return;
            handleClose();
            addItemsUi("itemLinkArea");
          }}
          sx={{
            fontSize: 14,
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "#e3f2fd",
            },
          }}
        >
          Item Pindah Area
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (mode === "defaultConf") {
              return toast.error(
                "Konfigurasi Default Virtual Tour Tidak mendukung Game Simulasi"
              );
            }

            if (load) return;
            addItemsUi("itemLinkGS");
            handleClose();
          }}
          sx={{
            fontSize: 14,
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "#e3f2fd",
            },
          }}
        >
          Item Link Game Simulasi
        </MenuItem>
      </Menu>
    </div>
  );
}

export default MenuRightAdmin;
