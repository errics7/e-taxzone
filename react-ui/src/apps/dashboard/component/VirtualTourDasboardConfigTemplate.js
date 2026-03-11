import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../utils/host.config";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ShimmerTitle } from "react-shimmer-effects";
import Bannerhot from "../../virtualtour360/assets/icon/Polinema.png";
import Placement from "@mui/icons-material/QueuePlayNext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import swal from "sweetalert";
import { Button, CircularProgress, Divider } from "@mui/material";
import ModalNewAreaVT from "./ModalNewAreaVT";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { refresh } from "../../../redux/counterSlice";
import ModalEditAreaVT from "./ModalEditAreaVT";
import { Link } from "react-router-dom";
import PopMenuRowAreaVTAdmin from "./PopMenuRowAreaVTAdmin";
import { findIndex } from "lodash";

function VirtualTourDasboardConfigTemplate(props) {
  const { data, typee, codeId } = props;
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [dataInfo, setDataInfo] = useState(null);
  const [newArea, setNewArea] = useState(false);
  const [editArea, setEditArea] = useState(false);

  useEffect(() => {
    const resetSelect = () => {
      setSelectedData(null);
    };

    resetSelect();
  }, [typee]);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios
        .get(`${API.HOST}/api/v2/virtualtour/area/by/${selectedData.id}/data`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        })
        .then((res) => {
          setLoad(false);
          setDataInfo(res.data);

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

          if (error.response.status === 401) {
            toast.error("Sesi berahir silahkan login ulang");
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

    if (selectedData) fetchData();
  }, [selectedData]);

  const hapusArea = () => {
    swal({
      title: `Peringatan`,
      text: `Anda akan menghapus ${selectedData.name} ?`,
      icon: "warning",
      buttons: ["batal", " Hapus"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        //
        setLoad(true);
        const callupload = axios.post(
          `${API.HOST}/api/v2/virtualtour/area/delete`,
          {
            idvt: data.virtualtour_id,
            idarea: selectedData.id,
            list: JSON.stringify(data.list),
            name: selectedData.name,
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
            loading: "Menghapus Area ...",
            success: (data) => {
              setLoad(false);
              if (data.data.success) {
                dispatch(refresh());
              }
              setSelectedData(null);
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
      } else {
        return;
      }
    });
  };

  const getid = () => {
    var idx = 0;
    if (selectedData !== null) {
      idx = selectedData.id;
    } else {
      idx = data.list[0]?.id;
    }
    return idx;
  };

  const swapArrayLocs = (arr, index1, index2) => {
    var arry = [...arr];
    var temp = arry[index1];

    arry[index1] = arry[index2];
    arry[index2] = temp;
    return arry;
  };

  const moveDataArea = (A1, A2) => {
    const list = [...data.list];
    const p1 = findIndex(data.list, (x) => x.id === A1.id);
    const p2 = findIndex(data.list, (x) => x.id === A2.id);
    const newpos = [...swapArrayLocs(list, p1, p2)];
 
    const updateloc = axios.post(
      `${API.HOST}/api/v2/virtualtour/area/updatemenuarea`,
      {
        id: data.id,
        arealist: JSON.stringify(newpos),
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );

    toast.promise(
      updateloc,
      {
        loading: "Memperbarui Area Menu...",
        success: (data) => {
          setLoad(false);
          if (data.data.success) {
            dispatch(refresh());
          }
          setSelectedData(null);
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
    <div className="bg-white shadow-md rounded  flex flex-col">
      <div className="flex">
        <div className="flex-shrink-0 w-72 m-3">
          <span
            className={`px-5 py-3 inline-block w-full ${
              typee === "manufaktur" ? "bg-sky-100" : "bg-emerald-100"
            } font-semibold`}
          >
            Area Menu
          </span>
          {/* Left Preview */}
          <div className="mt-2 rounded  border shadow bg-white text-slate-600">
            <div className={`py-10 px-3  bg-sky-200`}>
              <LazyLoadImage
                alt="banner-virtualtour"
                src={Bannerhot}
                effect="blur"
              />
            </div>
            <div className="max-h-30v overflow-y-auto">
              {data ? (
                data.list.length !== 0 ? (
                  data.list.map((item, i) => {
                    const slct = selectedData
                      ? selectedData.id === item.id
                        ? true
                        : false
                      : false;
                    return (
                      <div key={i} className="relative">
                        <Button
                          size="medium"
                          fullWidth
                          style={{
                            position: "realtive",
                            borderRadius: 0,
                            paddingLeft: 5,
                            paddingRight: 5,
                          }}
                          onClick={() => setSelectedData(item)}
                        >
                          {slct && (
                            <ArrowForwardIcon
                              fontSize="small"
                              className="absolute inset-x-0 left-3"
                            />
                          )}
                          <p
                            className={`truncate ${!slct && "text-slate-600"}`}
                          >
                            {item.name}
                          </p>
                        </Button>
                        <div className="absolute z-50 top-1 right-1 flex items-center">
                          <PopMenuRowAreaVTAdmin
                            indx={i}
                            length={data.list.length}
                            visibility={item.show}
                            moveUp={() =>
                              moveDataArea(data.list[i], data.list[i - 1])
                            }
                            moveDown={() =>
                              moveDataArea(data.list[i], data.list[i + 1])
                            }
                            // addRow={() => tambahDataAkun(i + 1)}
                            // removeRow={() => removeDataAkun(el.uid)}
                          />
                        </div>
                        <Divider />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-center border-b">
                    <div className="text-center my-2 relative">
                      Area Kosong,
                      <br /> Klik untuk menambah baru
                      <div className="absolute top-0 right-1  w-1 h-1 animate-pulse bg-red-500 rounded-full z-10"></div>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-1">
                  <ShimmerTitle line={1} variant="secondary" />
                  <ShimmerTitle line={1} variant="secondary" />
                  <ShimmerTitle line={1} variant="secondary" />
                </div>
              )}
              <div className="flex justify-center py-3">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  // className={classes.button}
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setNewArea(true)}
                >
                  Tambah Area Baru
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 m-3 relative">
          <span
            className={`inline-block w-full bg-gradient-to-r ${
              typee === "manufaktur" ? "from-sky-100" : "from-emerald-100"
            } font-semibold text-left p-3`}
          >
            Detail Area
          </span>
          <div className="text-left">
            {/* content list*/}
            <div className="w-full my-2 relative">
              {selectedData ? (
                dataInfo && dataInfo.success && !load ? (
                  <div>
                    <ul className="list-disc pl-8 space-y-2">
                      <li>
                        Info : {dataInfo.data.item_count} Total informasi barang
                      </li>
                      <li>
                        Area : {dataInfo.data.linkarea_count} Link pindah Area
                      </li>
                      <li>
                        Game Simulasi : {dataInfo.data.linksimulasi_count} Link
                        ke Game Simulasi
                      </li>
                    </ul>
                    <div className="flex flex-row-reverse mt-5 space-x-3">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        // className={classes.button}
                        startIcon={<DeleteForeverIcon />}
                        onClick={() => hapusArea()}
                      >
                        Hapus Area
                      </Button>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        style={{
                          marginRight: 8,
                        }}
                        startIcon={<EditIcon />}
                        onClick={() => setEditArea(true)}
                      >
                        Update data Area
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-1">
                    <div className="absolute inset-0 flex justify-center items-center z-50">
                      <CircularProgress />
                    </div>
                    <ShimmerTitle line={1} variant="secondary" />
                    <ShimmerTitle line={1} variant="secondary" />
                    <ShimmerTitle line={1} variant="secondary" />
                  </div>
                )
              ) : (
                <div className="p-5">Pilih Area untuk mengetahui detail</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="text-center w-full">
        {data && data.list.length !== 0 && (
          <Link to={`/virtualtour/config/default/${codeId}/${getid()}`}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<Placement />}
            >
              Masuk ke Pengaturan Area
            </Button>
          </Link>
        )}
      </div>
      <br />
      <ModalNewAreaVT
        open={newArea}
        data={data} //data gs_vt
        close={() => setNewArea(false)}
      />

      {editArea && (
        <ModalEditAreaVT
          open={editArea}
          idArea={selectedData && selectedData.id}
          data={data} //data gs_vt
          close={() => setEditArea(false)}
        />
      )}
    </div>
  );
}

export default VirtualTourDasboardConfigTemplate;
