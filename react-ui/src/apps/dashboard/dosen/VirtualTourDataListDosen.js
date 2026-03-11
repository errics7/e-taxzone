import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../utils/host.config";
import PilihScenario from "../component/PilihScenario";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingWait from "../component/LoadingWait";
import { Helmet } from "react-helmet";
import VirtualTourDasboardConfig from "../component/VirtualTourDasboardConfig";

function VirtualTourDataListDosen(props) {
  const { code } = useParams();
  const state = useSelector((state) => state);
  const refresh = state.counter.value;
  const authorize = state.user.value.authorize;
  const [load, setLoad] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios
        .get(`${API.HOST}/api/v2/virtualtour/f/${code}/data`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        })
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
          }
        })
        .catch((error) => {
          setLoad(false);
          // console.log(error.response.data);

          if (error.response.status === 401) {
            toast.error("Sesi berahir silahkan login ulang");
            // dispatch({ type: "LOGOUT" });
          } else {
            toast.error(error.response.data.message, {
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
          }
        });
    };

    if (code !== "-") {
      fetchData();
    }
  }, [refresh, code]);

  return (
    <div className="flex flex-col">
      <Helmet>
        <title className="capitalize">
          Virtual Tour Kontrol |{" "}
          {authorize.charAt(0).toUpperCase() + authorize.slice(1)}
        </title>
      </Helmet>
      <PilihScenario source="virtualtour" />
      <div>
        {load && <LoadingWait />}
        {code !== "-" ? (
          <VirtualTourDasboardConfig data={data && data.data} />
        ) : (
          <div className="my-3 p-5 bg-white shadow min-h-25v">
            Pilih Sekenario Kelas
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualTourDataListDosen;
