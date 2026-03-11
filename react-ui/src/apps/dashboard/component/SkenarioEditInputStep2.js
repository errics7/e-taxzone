import React, { useState } from "react";
import {
  Grid,
  Checkbox,
  Button,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import { filter, sumBy } from "lodash";
import { useDispatch } from "react-redux";
import { refresh } from "../../../redux/counterSlice";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import CloseIcon from "@mui/icons-material/Close";
import swal from "sweetalert";

function SkenarioEditInputStep2(props) {
  const { dataScn, dataWsScn, onClose } = props;
  const data = dataWsScn.data;
  const dispatch = useDispatch();
  const [isLoad, setIsLoad] = useState(false);
  const [type, setType] = useState(data.type);
  const [activeAll, setActiveAll] = useState(false);
  //#region Prepare data
  const [gs1, setGs1] = useState(data.gs1_title !== "" ? true : false);
  const [gs2, setGs2] = useState(data.gs2_title !== "" ? true : false);
  const [gs3, setGs3] = useState(data.gs3_title !== "" ? true : false);
  const [gs4, setGs4] = useState(data.gs4_title !== "" ? true : false);
  const [gs5, setGs5] = useState(data.gs5_title !== "" ? true : false);
  const [gs6, setGs6] = useState(data.gs6_title !== "" ? true : false);
  const [gs7, setGs7] = useState(data.gs7_title !== "" ? true : false);
  const [gs8, setGs8] = useState(data.gs8_title !== "" ? true : false);
  const [gs9, setGs9] = useState(data.gs9_title !== "" ? true : false);
  const [gs10, setGs10] = useState(data.gs10_title !== "" ? true : false);
  const [gs11, setGs11] = useState(data.gs11_title !== "" ? true : false);
  const [gs12, setGs12] = useState(data.gs12_title !== "" ? true : false);
  const [gs13, setGs13] = useState(data.gs13_title !== "" ? true : false);
  const [gs14, setGs14] = useState(data.gs14_title !== "" ? true : false);
  const [gs15, setGs15] = useState(data.gs15_title !== "" ? true : false);
  const [gs16, setGs16] = useState(data.gs16_title !== "" ? true : false);
  const [gs17, setGs17] = useState(data.gs17_title !== "" ? true : false);
  const [gs18, setGs18] = useState(data.gs18_title !== "" ? true : false);
  //Perdagangan
  const [perdagangan1, setPerdagangan1] = useState(
    data.prdg1_title !== "" ? true : false
  );
  const [perdagangan2, setPerdagangan2] = useState(
    data.prdg2_title !== "" ? true : false
  );
  const [perdagangan3, setPerdagangan3] = useState(
    data.prdg3_title !== "" ? true : false
  );
  const [perdagangan4, setPerdagangan4] = useState(
    data.prdg4_title !== "" ? true : false
  );
  const [perdagangan5, setPerdagangan5] = useState(
    data.prdg5_title !== "" ? true : false
  );
  const [perdagangan6, setPerdagangan6] = useState(
    data.prdg6_title !== "" ? true : false
  );
  const [perdagangan7, setPerdagangan7] = useState(
    data.prdg7_title !== "" ? true : false
  );
  const [perdagangan8, setPerdagangan8] = useState(
    data.prdg8_title !== "" ? true : false
  );
  const [perdagangan9, setPerdagangan9] = useState(
    data.prdg9_title !== "" ? true : false
  );
  const [perdagangan10, setPerdagangan10] = useState(
    data.prdg10_title !== "" ? true : false
  );
  const [perdagangan11, setPerdagangan11] = useState(
    data.prdg11_title !== "" ? true : false
  );
  const [perdagangan12, setPerdagangan12] = useState(
    data.prdg12_title !== "" ? true : false
  );
  const [perdagangan13, setPerdagangan13] = useState(
    data.prdg13_title !== "" ? true : false
  );
  const [perdagangan14, setPerdagangan14] = useState(
    data.prdg14_title !== "" ? true : false
  );
  const [perdagangan15, setPerdagangan15] = useState(
    data.prdg15_title !== "" ? true : false
  );
  const [perdagangan16, setPerdagangan16] = useState(
    data.prdg16_title !== "" ? true : false
  );
  const [perdagangan17, setPerdagangan17] = useState(
    data.prdg17_title !== "" ? true : false
  );

  const gamelist = [
    {
      name: "perdagangan1",
      defname: "Game Simulasi 1",
      desc: "Game Simulasi Perdagangan 1 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan1,
      func: function (x = perdagangan1) {
        setPerdagangan1(!x);
      },
    },
    {
      name: "perdagangan2",
      defname: "Game Simulasi 2",
      desc: "Game Simulasi Perdagangan 2 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan2,
      func: function (x = perdagangan2) {
        setPerdagangan2(!x);
      },
    },
    {
      name: "perdagangan3",
      defname: "Game Simulasi 3",
      desc: "Game Simulasi Perdagangan 3 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan3,
      func: function (x = perdagangan3) {
        setPerdagangan3(!x);
      },
    },
    {
      name: "perdagangan4",
      defname: "Game Simulasi 4",
      desc: "Game Simulasi Perdagangan 4 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan4,
      func: function (x = perdagangan4) {
        setPerdagangan4(!x);
      },
    },
    {
      name: "perdagangan5",
      defname: "Game Simulasi 5",
      desc: "Game Simulasi Perdagangan 5 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan5,
      func: function (x = perdagangan5) {
        setPerdagangan5(!x);
      },
    },
    {
      name: "perdagangan6",
      defname: "Game Simulasi 6",
      desc: "Game Simulasi Perdagangan 6 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan6,
      func: function (x = perdagangan6) {
        setPerdagangan6(!x);
      },
    },
    {
      name: "perdagangan7",
      defname: "Game Simulasi 7",
      desc: "Game Simulasi Perdagangan 7 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan7,
      func: function (x = perdagangan7) {
        setPerdagangan7(!x);
      },
    },
    {
      name: "perdagangan8",
      defname: "Game Simulasi 8",
      desc: "Game Simulasi Perdagangan 8 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan8,
      func: function (x = perdagangan8) {
        setPerdagangan8(!x);
      },
    },
    {
      name: "perdagangan9",
      defname: "Game Simulasi 9",
      desc: "Game Simulasi Perdagangan 9 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan9,
      func: function (x = perdagangan9) {
        setPerdagangan9(!x);
      },
    },
    {
      name: "perdagangan10",
      defname: "Game Simulasi 10",
      desc: "Game Simulasi Perdagangan 10 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan10,
      func: function (x = perdagangan10) {
        setPerdagangan10(!x);
      },
    },
    {
      name: "perdagangan11",
      defname: "Game Simulasi 11",
      desc: "Game Simulasi Perdagangan 11 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan11,
      func: function (x = perdagangan11) {
        setPerdagangan11(!x);
      },
    },
    {
      name: "perdagangan12",
      defname: "Game Simulasi 12",
      desc: "Game Simulasi Perdagangan 12 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan12,
      func: function (x = perdagangan12) {
        setPerdagangan12(!x);
      },
    },
    {
      name: "perdagangan13",
      defname: "Game Simulasi 13",
      desc: "Game Simulasi Perdagangan 13 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan13,
      func: function (x = perdagangan13) {
        setPerdagangan13(!x);
      },
    },
    {
      name: "perdagangan14",
      defname: "Game Simulasi 14",
      desc: "Game Simulasi Perdagangan 14 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan14,
      func: function (x = perdagangan14) {
        setPerdagangan14(!x);
      },
    },
    {
      name: "perdagangan15",
      defname: "Game Simulasi 15",
      desc: "Game Simulasi Perdagangan 15 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan15,
      func: function (x = perdagangan15) {
        setPerdagangan15(!x);
      },
    },
    {
      name: "perdagangan16",
      defname: "Game Simulasi 16",
      desc: "Game Simulasi Perdagangan 16 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan16,
      func: function (x = perdagangan16) {
        setPerdagangan16(!x);
      },
    },
    {
      name: "perdagangan17",
      defname: "Game Simulasi 17",
      desc: "Game Simulasi Perdagangan 17 ...",
      type: "perdagangan",
      avail: true, //Tersedia
      val: perdagangan17,
      func: function (x = perdagangan17) {
        setPerdagangan17(!x);
      },
    },
    {
      name: "gs1",
      defname: "Game Simulasi 1",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 1 ...",
      avail: true,
      val: gs1,
      func: function (x = gs1) {
        setGs1(!x);
      },
    },
    {
      name: "gs2",
      defname: "Game Simulasi 2",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 2 ...",
      avail: true,
      val: gs2,
      func: function (x = gs2) {
        setGs2(!x);
      },
    },
    {
      name: "gs3",
      defname: "Game Simulasi 3",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 3 ...",
      avail: true,
      val: gs3,
      func: function (x = gs3) {
        setGs3(!x);
      },
    },
    {
      name: "gs4",
      defname: "Game Simulasi 4",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 4 ...",
      avail: true,
      val: gs4,
      func: function (x = gs4) {
        setGs4(!x);
      },
    },
    {
      name: "gs5",
      defname: "Game Simulasi 5",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 5 ...",
      avail: true,
      val: gs5,
      func: function (x = gs5) {
        setGs5(!x);
      },
    },
    {
      name: "gs6",
      defname: "Game Simulasi 6",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 6 ...",
      avail: true, //Tersedia
      val: gs6,
      func: function (x = gs6) {
        setGs6(!x);
      },
    },
    {
      name: "gs7",
      defname: "Game Simulasi 7",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 7 ...",
      avail: true, //Tersedia
      val: gs7,
      func: function (x = gs7) {
        setGs7(!x);
      },
    },
    {
      name: "gs8",
      defname: "Game Simulasi 8",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 8 ...",
      avail: true, //Tersedia
      val: gs8,
      func: function (x = gs8) {
        setGs8(!x);
      },
    },
    {
      name: "gs9",
      defname: "Game Simulasi 9",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 9 ...",
      avail: true, //Tersedia
      val: gs9,
      func: function (x = gs9) {
        setGs9(!x);
      },
    },
    {
      name: "gs10",
      defname: "Game Simulasi 10",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 10 ...",
      avail: true, //Tersedia
      val: gs10,
      func: function (x = gs10) {
        setGs10(!x);
      },
    },
    {
      name: "gs11",
      defname: "Game Simulasi 11",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 11 ...",
      avail: true, //Tersedia
      val: gs11,
      func: function (x = gs11) {
        setGs11(!x);
      },
    },
    {
      name: "gs12",
      defname: "Game Simulasi 12",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 12 ...",
      avail: true, //Tersedia
      val: gs12,
      func: function (x = gs12) {
        setGs12(!x);
      },
    },
    {
      name: "gs13",
      defname: "Game Simulasi 13",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 13 ...",
      avail: true, //Tersedia
      val: gs13,
      func: function (x = gs13) {
        setGs13(!x);
      },
    },
    {
      name: "gs14",
      defname: "Game Simulasi 14",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 14 ...",
      avail: true, //Tersedia
      val: gs14,
      func: function (x = gs14) {
        setGs14(!x);
      },
    },
    {
      name: "gs15",
      defname: "Game Simulasi 15",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 15 ...",
      avail: true, //Tersedia
      val: gs15,
      func: function (x = gs15) {
        setGs15(!x);
      },
    },
    {
      name: "gs16",
      defname: "Game Simulasi 16",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 16 ...",
      avail: true, //Tersedia
      val: gs16,
      func: function (x = gs16) {
        setGs16(!x);
      },
    },
    {
      name: "gs17",
      defname: "Game Simulasi 17",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 17 ...",
      avail: true, //Tersedia
      val: gs17,
      func: function (x = gs17) {
        setGs17(!x);
      },
    },
    {
      name: "gs18",
      defname: "Game Simulasi 18",
      type: "manufaktur",
      desc: "Game Simulasi Manufaktur 18 ...",
      avail: true, //Tersedia
      val: gs18,
      func: function (x = gs18) {
        setGs18(!x);
      },
    },
  ];
  //#endregion

  const createProcess = () => {
    const totActive = sumBy(
      filter(gamelist, { type: type }),
      (x) => x.val === true
    );
    const newGmList = gamelist.map((el) => {
      return el.type !== type
        ? {
            ...el,
            val: false,
            defname: "",
          }
        : {
            ...el,
          };
    });

    // console.log(totActive);  
    if (isLoad) return;
    if (totActive < 1) {
      toast.error("Aktifkan minimal 1 Game Simulasi pada scenario ini", {
        duration: 4000,
      });
      return;
    }
    //Call
    setIsLoad(true);
    const callCreate = axios.post(
      `${API.HOST}/api/v2/skenario/updategsworksheet`,
      {
        scene: {
          id: dataScn.scn_id,
        },
        type: type,
        gsctrl: data,
        gamelist: newGmList,
        gs_count: totActive,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );

    toast.promise(
      callCreate,
      {
        loading: "Update Game Simulasi ...",
        success: (data) => {
          setIsLoad(false);
          if (data.data.success) {
            props.setPosisi(1);
            onClose();
            dispatch(refresh());
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
          setIsLoad(false);
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
          duration: 1000,
          icon: "",
        },
        error: {
          duration: 4500,
          icon: "",
        },
      }
    );
  };

  const setToActiveAll = (x) => {
    setActiveAll(!x);
    filter(gamelist, { type: type }).forEach((element) => {
      element.func(x);
    });
  };

  return (
    <div>
      <div className="flex items-center">
        <div className="-mt-3 mb-2 font-semibold">
          Pilih Jenis Game Simulasi :
        </div>
      </div>
      <div className="border-b">
        <ul className="flex cursor-pointer">
          <li
            onClick={() => setType("manufaktur")}
            className={`cursor-pointer py-2 px-6 mx-1 rounded-t-lg ${
              type === "manufaktur"
                ? "text-white bg-blue-400"
                : "text-slate-500 bg-slate-200 border-slate-800"
            }`}
          >
            Manufaktur
          </li>
          <li
            onClick={() => setType("perdagangan")}
            className={`cursor-pointer py-2 px-6 mx-1 rounded-t-lg ${
              type === "perdagangan"
                ? "text-white bg-emerald-400"
                : "text-slate-500 bg-slate-200 border-slate-800"
            }`}
          >
            Perdagangan
          </li>
        </ul>
      </div>
      <div className="p-3 grow bg-slate-100 rounded-b-md">
        <Grid
          container
          spacing={2}
          className="relative max-h-96 overflow-y-scroll"
        >
          {filter(gamelist, { type: type }).map((data, index) => {
            return (
              <Grid key={index} item xs={12} md={4} lg={3}>
                <div
                  className={`bg-white h-36 rounded shadow hover:shadow-lg flex flex-col border-t relative ${
                    !data.avail && "filter blur-xs"
                  }`}
                >
                  <FormControlLabel
                    value="start"
                    style={{ paddingRight: 10 }}
                    control={
                      <Checkbox
                        color="primary"
                        checked={data.val}
                        onChange={() => data.func(data.val)}
                        disabled={!data.avail}
                      />
                    }
                    label="Aktif"
                    labelPlacement="start"
                  />
                  <div className="flex items-end grow">
                    <div
                      className={`flex-col h-20 w-full px-2 bg-gradient-to-t ${
                        type === "manufaktur"
                          ? "from-sky-100"
                          : "from-emerald-100"
                      } rounded-b`}
                    >
                      <h2 className="text-base lg:text-xl pt-3">
                        {data.defname}
                      </h2>
                      <p className="text-xs lg:text-sm ">{data.desc}</p>
                    </div>
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>
      <div className="flex items-center justify-between w-full px-6 my-5">
        <div className="flex -mt-3 mb-3">
          <b>Info :</b>
          <div className="pl-2">
            <div>
              &nbsp;
              {sumBy(
                filter(gamelist, { type: type }),
                (x) => x.val === true
              )}{" "}
              &nbsp;Game Aktif
            </div>
            <FormControlLabel
              value="start"
              style={{ paddingRight: 10 }}
              control={
                <Checkbox
                  color="primary"
                  checked={activeAll}
                  onChange={() => setToActiveAll(activeAll)}
                />
              }
              label="Aktifkan semua"
              labelPlacement="end"
            />
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (data.type !== type) {
                swal({
                  title: `Anda mengganti model worksheet ke ${type}?`,
                  text: "Data worksheet sebelumnya akan terhapus, anda tidak dapat mengembalikan data yang telah tehapus.",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    createProcess();
                  } else {
                    // swal("Your imaginary file is safe!");
                  }
                });
              } else {
                createProcess();
              }
            }}
            disabled={isLoad}
            startIcon={<SaveAsIcon />}
          >
            Simpan Perubahan
          </Button>

          <Button
            onClick={() => onClose()}
            variant="outlined"
            color="primary"
            disabled={isLoad}
            startIcon={
              isLoad ? (
                <CircularProgress size={20} thickness={4} />
              ) : (
                <CloseIcon />
              )
            }
          >
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SkenarioEditInputStep2;
