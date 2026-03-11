import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";
import swal from "sweetalert";
import API from "../../utils/host.config";
import LoadingWait from "../dashboard/component/LoadingWait";
import { useSelector } from "react-redux";
import VRPannellumBasic from "./components/VRPannellumBasic";
import MenuLeftBasic from "./components/MenuLeftBasic";
import ModalPopContainer from "./components/ModalPopContainer";
import { Button } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function VirtualTourArea(props) {
  const history = useHistory();
  const { code, id } = useParams();
  const cRefresh = useSelector((state) => state.counter);
  const camRef = useRef();

  const [load, setLoad] = useState(false);
  const [data, setData] = useState(null);
  const [dataInfo, setDataInfo] = useState([]);
  const [selectedid, setSelectedid] = useState(id);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios
        .get(
          `${API.HOST}/api/v2/virtualtour/mahasiswa/${code}/${selectedid}/data`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("xtoken"),
            },
          }
        )
        .then((res) => {
          setLoad(false);
          setData(res.data);

          if (!res.data.success) {
            toast.error(res.data.message, {
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
            });
          } else {
            setDataInfo(res.data.data.items_list);
            camRef.current.forceRender();
          }
        })
        .catch((error) => {
          setLoad(false);
          console.log(error.response.status);

          if (error.response.status === 401) {
            toast.error("Sesi berahir silahkan login ulang");
            // dispatch({ type: "LOGOUT" });
          }
          if (error.response.status === 400) {
            swal({
              title: "Peringatan",
              text: error.response.data.message,
              icon: "error",
              closeOnClickOutside: false,
              buttons: {
                // cancel: "Batal",
                catch: {
                  text: "kembali",
                  value: "oke",
                  className: "mx-auto",
                },
              },
            }).then((value) => {
              switch (value) {
                case "oke":
                  history.replace("/login");
                  break;
                default:
                  return;
              }
            });
          }
        });
    };

    fetchData();
  }, [code, history, selectedid, cRefresh.value]);

  return (
    <div className="relative h-screen w-screen">
      <Helmet>
        <title>Virtual Tour</title>
      </Helmet>

      <div className="absolute top-3 right-3 z-40 opacity-60 hover:opacity-100 backdrop-blur-sm">
        <Button
          variant="contained"
          color="primary"
          startIcon={<ExitToAppIcon />}
          onClick={() => {
            history.push(`/home/f/${code}/virtualtour`);
          }}
        >
          Keluar
        </Button>
      </div>

      {load && <LoadingWait />}

      <MenuLeftBasic
        dataMenu={data && data.data.menu}
        dataArea={data && data.data.area}
        selectedid={selectedid}
        setSelectedid={(x) => setSelectedid(x)}
      />

      <VRPannellumBasic
        camRef={camRef}
        dataMenu={data && data.data.menu}
        dataArea={data && data.data.area}
        dataInfo={dataInfo ? dataInfo : []}
        selectedid={selectedid}
        setSelectedid={(x) => setSelectedid(x)}
      />

      <ModalPopContainer
        selectedid={selectedid}
        menu={data && data.data.menu}
        dataInfo={dataInfo}
        setDataInfo={(x) => setDataInfo(x)}
      />
    </div>
  );
}

export default VirtualTourArea;
