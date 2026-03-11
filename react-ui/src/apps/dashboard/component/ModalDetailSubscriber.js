//#region
import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../utils/host.config";
import { Button, CircularProgress, createTheme, Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles, ThemeProvider } from "@mui/styles";
import toast from "react-hot-toast";
import swal from "sweetalert";
import MUIDataTable from "mui-datatables";
import BlockIcon from "@mui/icons-material/Block";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
//#endregion

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnerror: {
    backgroundColor: "#FF5A52",
  },
}));

const getMuiTheme = () =>
  createTheme({
    components: {
      MUIDataTable: {
        styleOverrides: {
          paper: {
            boxShadow: "none",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#92D050",
          },
        },
      },
    },
  });

export default function ModalDetailSubscriber(props) {
  const { modalData } = props;
  const classes = useStyles();
  const [load, setLoad] = useState(false);
  const [data, setData] = useState(null);
  const [counter, setCounter] = useState(1);

  const onClose = () => {
    props.close();
  };

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(
        `${API.HOST}/api/v2/skenario/subscriber/detail/${modalData.scn_id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        }
      )
        .then((res) => {
          setLoad(false);
          setData(res.data);
        })
        .catch((error) => {
          setLoad(false);
          if (error.response.status === 401) {
            toast.error("Sesi berahir.");
            // dispatch({ type: "LOGOUT" });
          } else {
            toast.error(
              error.response.data.message
              //   "Terjadi Keslahan server, Silahkan refresh halaman kembali."
            );
          }
        });
    };
    if (modalData.scn_id) {
      fetchData();
    }
  }, [modalData.scn_id, counter]);

  const confirmCall = (data, st) => { 
    return axios
      .post(
        `${API.HOST}/api/v2/skenario/subscriber/update`,
        {
          idu: data?.user_id,
          scen_id: data?.scen_id,
          named: data?.nama,
          action: st,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        }
      )
      .finally(() => {
        setLoad(false);
      });
  };

  const confirmationUser = (id, status) => {
    if (load) return;
    setLoad(true);

    let promise = confirmCall(data.data[id], status);
    toast.promise(
      promise,
      {
        loading: "Sedang Memproses...",
        success: (data) => {
          setCounter(counter + 1);

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
          icon: "",
        },
      }
    );
  };

  const columns = [
    {
      label: "Nama",
      name: "nama",
    },
    {
      label: "NIM",
      name: "nim",
    },
    {
      label: "Kelas",
      name: "kelas",
    },
    {
      label: "Tanggal Daftar kelas",
      name: "created_date",
    },
    {
      label: "Status",
      name: "status",
      options: {
        customBodyRenderLite: (dataIndex) => {
          return (
            <div className="flex justify-start">
              <div
                className={`${
                  data.data[dataIndex]?.status === "Aktif"
                    ? "bg-emerald-500 text-white"
                    : "bg-red-400 shadow-sm text-white"
                } rounded font-bold py-1 px-4 mx-1 text-xs focus:outline-none`}
              >
                {data.data[dataIndex]?.status === "Block" && (
                  <BlockIcon fontSize="small" className="p-0.5 -mt-0.5" />
                )}{" "}
                {data.data[dataIndex]?.status}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "Aksi",
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellHeaderProps: (value) => {
          return {
            style: {
              textAlign: "center",
            },
          };
        },
        customBodyRenderLite: (dataIndex) => {
          return (
            <div className="flex justify-around">
              {data.data[dataIndex]?.status === "Block" ? (
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  startIcon={<AccessibilityNewIcon />}
                  onClick={(event) => {
                    swal(
                      `Anda akan Membuka blokir akun "${data.data[dataIndex]?.nama}" dari kelas ini ?`,
                      {
                        buttons: {
                          cancel: "Batal",
                          catch: {
                            text: "Bebaskan",
                            value: "oke",
                            className: "ml-5",
                          },
                        },
                        icon: "info",
                        dangerMode: true,
                      }
                    ).then((value) => {
                      switch (value) {
                        case "oke":
                          confirmationUser(dataIndex, "unblock");
                          break;
                        default:
                          return;
                      }
                    });
                  }}
                >
                  Bebaskan
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<BlockIcon />}
                  onClick={(event) => {
                    swal(
                      `Anda akan memblokir akun "${data.data[dataIndex]?.nama}" dari kelas ini ?`,
                      {
                        buttons: {
                          cancel: "Batal",
                          catch: {
                            text: "Blokir",
                            value: "oke",
                            className: "ml-5",
                          },
                        },
                        icon: "info",
                        dangerMode: true,
                      }
                    ).then((value) => {
                      switch (value) {
                        case "oke":
                          confirmationUser(dataIndex, "block");
                          break;
                        default:
                          return;
                      }
                    });
                  }}
                >
                  Block
                </Button>
              )}
            </div>
          );
        },
      },
    },
  ];

  const options = {
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15, 25],
    filter: true,
    viewColumns: false,
    download: false,
    print: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "Tidak ada Mahasiswa yang masuk di kelas ini.",
      },
    },
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className="z-50 relative min-h-40v max-h-screen overflow-y-auto bg-white rounded w-3/4 2xl:w-3/4 flex flex-col items-center outline-none">
            <div className="relative flex w-full items-center">
              <h2 className="w-full text-center text-2xl pt-5 py-4 border-b">
                Detail Subscriber Kelas
              </h2>
              <div className="absolute inset-y-0 right-0 pt-2">
                <IconButton onClick={onClose} size="large">
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            {load && (
              <div className="absolute inset-0 flex justify-center items-center z-50">
                <CircularProgress />
              </div>
            )}
            <div className="px-5 flex flex-col w-full">
              <ThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  data={data ? data.data : []}
                  columns={columns}
                  options={options}
                />
              </ThemeProvider>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
