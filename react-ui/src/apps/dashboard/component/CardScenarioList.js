import React, { useState } from "react";
import swal from "sweetalert";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../utils/host.config";
import ModalDataScenario from "./ModalDataScenario";
import MenuPopOverScenario from "./MenuPopOverScenario";
import { refresh } from "../../../redux/counterSlice";
import ModalEditSkenario from "./ModalEditSkenario";
import Lottie from "lottie-react";
import virtualtour from "../assets/lottie/learn.json";
import emptyfile from "../assets/lottie/emptyfile.json";
import ShimmerScenarioList from "./ShimmerScenarioList";
import BadgeIcon from "@mui/icons-material/Badge";
import { Tooltip } from "@mui/material";
import ModalDetailSubscriber from "./ModalDetailSubscriber";

const CardScenarioList = ({ data }) => {
  const users = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalSubscriber, setOpenModalSubscriber] = useState(false);
  const [modalData, setModalData] = useState({});
  const handleClose = () => setOpen((prev) => !prev);
  const dispatch = useDispatch();

  const confirmToDelete = (el) => {
    swal(`Anda akan menghapus scenario "${el.nama}" ?`, {
      buttons: {
        cancel: "Batal",
        catch: {
          text: "Hapus",
          value: "oke",
          className: "ml-5",
        },
      },
      icon: "warning",
      dangerMode: true,
    }).then((value) => {
      switch (value) {
        case "oke":
          const call = axios
            .post(
              `${API.HOST}/api/v2/skenario/deleted`,
              {
                deletedid: el.scn_id,
                name: el.nama,
              },
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("xtoken"),
                },
              }
            )
            .catch((error) => {
              if (error.response.status === 401) {
                toast.error("Sesi berahir.");
                // dispatch({ type: "LOGOUT" });
              }
              if (error.response.status === 400) {
                toast.error(
                  "Terjadi Keslahan server, Silahkan refresh halaman kembali."
                );
              }
            });
          toast.promise(
            call,
            {
              loading: "Menghapus skenario kelas ...",
              success: (data) => {
                dispatch(refresh());
                swal("Skenario kelas berhasil dihapus", {
                  icon: "success",
                });
                return "";
                // message
              },
              error: (error) => {
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
                duration: 1,
                icon: "",
              },
              error: {
                duration: 4500,
                icon: "",
              },
            }
          );
          break;
        default:
          return;
      }
    });
  };

  const onEditModal = (el) => {
    setOpenModalEdit(true);
    setModalData(el);
  };

  return (
    <>
      {data ? (
        data.map((item, index) => {
          const listWorksheet =
            item.worksheet === null
              ? ""
              : item.worksheet.split("|").filter((item) => item !== "");
          const listVirtualTour =
            item.virtualtour === null
              ? ""
              : item.virtualtour.split("|").filter((item) => item !== "");
          return (
            <div key={index} className="mt-5 min-w-full">
              <div className="bg-white shadow-md border rounded min-h-10v min-w-full">
                <div className="w-full">
                  <div className="w-full border-2">
                    <div className="flex flex-wrap justify-between p-2">
                      <div className="col-start-1 col-end-4  text-base">
                        <div className="flex align-middle">
                          <div className="hidden md:block">
                            <Lottie
                              style={{
                                maxHeight: 300,
                                maxWidth: 300,
                              }}
                              animationData={virtualtour}
                              loop={true}
                            />
                          </div>
                          <div>
                            <div className="flex flex-col ml-3 mt-4 space-y-2">
                              <h1 className="font-semibold">Nama:</h1>
                              <h1 className="capitalize text-2xl">
                                {item.nama}
                              </h1>
                            </div>
                            <div className="flex flex-col ml-3 mt-4 space-y-2">
                              <h1 className="font-semibold">Kode:</h1>
                              <h1 className="capitalize text-2xl">
                                {item.code}
                              </h1>
                            </div>
                            <div className="flex flex-col ml-3 mt-4 space-y-2">
                              <h1 className="font-semibold">Deskrispsi:</h1>
                              <p className="capitalize">{item.deskripsi}</p>
                            </div>
                            <div className="flex flex-col ml-3 mt-4 space-y-2">
                              <div>
                                <label className="mr-2 font-semibold">
                                  Subscriber :{" "}
                                </label>
                              </div>
                              <div className="flex items-center">
                                {item.subscriber_count | 0} Mahasiswa{" "}
                                <p
                                  className="text-blue-500 ml-2 cursor-pointer"
                                  onClick={() => {
                                    setModalData(item);
                                    setOpenModalSubscriber(true);
                                  }}
                                >
                                  Detail
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex flex-col items-center justify-end space-y-4 right-5">
                        <div className="w-full flex justify-end">
                          <MenuPopOverScenario
                            addRow={() => onEditModal(item)}
                            removeRow={() => confirmToDelete(item)}
                          />
                        </div>
                        <div>
                          <Tooltip
                            title={`Skenario dibuat oleh ${item.author}`}
                            placement="left"
                            arrow
                          >
                            <div
                              className={`max-w-20v truncate tracking-wider text-white ${users.value._id === item.created_by
                                ? "bg-emerald-400"
                                : "bg-sky-500"
                                } px-3 py-1 text-sm rounded leading-loose mx-2 font-semibold`}
                              title=""
                            >
                              <BadgeIcon
                                fontSize="small"
                                className="mr-1 -mt-1"
                              />
                              {item.author}
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <ShimmerScenarioList />
      )}
      {data && data.length === 0 && (
        <div className="flex justify-center items-center bg-white mt-5 shadow rounded">
          <Lottie
            style={{
              maxHeight: 300,
              maxWidth: 300,
            }}
            animationData={emptyfile}
            loop={true}
          />
          Anda tidak memiliki Skenario Kelas, Silahkan Buat terlebih dahulu.
        </div>
      )}

      <ModalDataScenario open={open} handleClose={handleClose} />
      <ModalEditSkenario
        open={openModalEdit}
        close={() => setOpenModalEdit((prev) => !prev)}
        dataScn={modalData}
        setDataScn={(el) => setModalData(el)}
      />
      <ModalDetailSubscriber
        open={openModalSubscriber}
        modalData={modalData}
        close={() => setOpenModalSubscriber((prev) => !prev)}
      />
    </>
  );
};

export default CardScenarioList;
