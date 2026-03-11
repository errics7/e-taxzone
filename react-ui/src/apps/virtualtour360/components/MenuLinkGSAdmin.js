import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clean } from "../../../redux/configSlice";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import makeStyles from "@mui/styles/makeStyles";
import { find, findIndex, remove } from "lodash";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import WorksheetGsListInVT from "./WorksheetGsListInVT";
import LoadingWait from "../../dashboard/component/LoadingWait";

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

function MenuLinkGSAdmin(props) {
  const { code } = useParams();
  const classes = useStyles();
  const { dataInfo, setDataInfo } = props;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const cfg = state.config;
  const data = find(dataInfo, { uid: cfg.data.uid });

  const [load, setLoad] = useState(false);
  const [listGS, setListGS] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios
        .post(
          `${API.HOST}/api/v2/skenario/gamesimulasilist`,
          {
            code: code,
            worksheet_id: state.scen.worksheet_id,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("xtoken"),
            },
          }
        )
        .then((res) => {
          setLoad(false);
          setListGS(res.data);
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
          console.log(error.response.data);
          toast.error(error.response.data.message);

          if (error.response.status === 401) {
            toast.error("Sesi berahir silahkan login ulang");
            // dispatch({ type: "LOGOUT" });
          }
        });
    };

    if (code !== "-") {
      fetchData();
    }
  }, [state, code]);

  const removeInfo = () => {
    const list = [...dataInfo];
    remove(list, { uid: cfg.data.uid });
    setDataInfo(list);
  };

  const onChangeTarget = (data) => {
    const list = [...dataInfo];
    const idx = findIndex(dataInfo, { uid: cfg.data.uid });
    list.splice(idx, 1, {
      ...list[idx],
      name: data.title,
      deskripsi: data.deskripsi,
      to_id: data.id,
      to_link: data.to,
    });

    console.log(list);
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

  return (
    <div className="w-full min-h-30v rounded overflow-hidden z-50 bg-slate-50 text-slate-600">
      <h1 className="text-left p-3 pt-5 pl-6 font-bold border-b">
        Detail link Game Simulasi : (terpilih - {data.name})
      </h1>
      <div className="mx-3 min-h-25v relative">
        {load && <LoadingWait />}
        <WorksheetGsListInVT
          select={data}
          data={listGS && listGS.data}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      </div>
      {/*footer*/}
      <div className="relative flex justify-end md:flex-row items-center p-6 border-t border-solid border-blueslate-200 rounded-b">
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
          >
            Batalkan Perubahan
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            className={classes.button}
            onClick={() => {
              setDefaultSrc();
              dispatch(clean());
            }}
          >
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MenuLinkGSAdmin;
