import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import ModalNewSkenario from "../component/ModalNewSkenario";
import CardScenarioList from "../component/CardScenarioList";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import useSWR from "swr";
import swal from "sweetalert";

function SkenarioListAdmin(props) {
  const state = useSelector((state) => state);
  const authorize = state.user.value.authorize;
  const [newScen, setNewScen] = useState(false);
  const refresh = useSelector((state) => state.counter.value);
  const [selector, setSelector] = useState(`${API.HOST}/api/v2/skenario/list`);

  const { data, error } = useSWR(
    selector + `?${refresh}`,
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
    <div className="relative min-h-1/2 px-2">
      <Helmet>
        <title>
          Daftar Skenario Kelas |{" "}
          {authorize.charAt(0).toUpperCase() + authorize.slice(1)}
        </title>
      </Helmet>
      {!data && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <CircularProgress />
        </div>
      )}
      <div className="flex justify-between">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setNewScen(true)}
          startIcon={<CreateNewFolderIcon />}
        >
          Buat Mata Pelajaran
        </Button>

        <ToggleButtonGroup
          color="primary"
          value={selector}
          exclusive
          onChange={(e, data) => {
            setSelector(data);
          }}
        >
          <ToggleButton value={`${API.HOST}/api/v2/skenario/list`}>
            dimiliki
          </ToggleButton>
          <ToggleButton value={`${API.HOST}/api/v2/skenario/listall`}>
            Semua
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <CardScenarioList data={data ? data.data : null} />
      <ModalNewSkenario open={newScen} close={() => setNewScen(false)} />
    </div>
  );
}

export default SkenarioListAdmin;
