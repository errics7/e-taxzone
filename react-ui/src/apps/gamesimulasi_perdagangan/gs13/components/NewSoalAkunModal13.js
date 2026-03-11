import React from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import makeStyles from "@mui/styles/makeStyles";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { find, findIndex, filter, differenceBy, uniqBy } from "lodash";
import { toast } from "react-hot-toast";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  btnsave: {
    // marginLeft: "25px",
    marginTop: "15px",
    marginBottom: "5px",
    textTransform: "capitalize",
    backgroundColor: "#2D90DA",
  },
  btndel: {
    marginBottom: "25px",
    textTransform: "capitalize",
  },
}));

export default function NewSoalAkunModal13(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig, rowuid, barisA } = props;

  //#region
  const pilihDataAkun = (uid) => {
    const iuid = findIndex(dataConfig.datasoal, { uid: rowuid });
    const list = [...dataConfig.datasoal];
    const listlisy = [...list[iuid].list];

    listlisy.splice(barisA, 0, uid);

    list.splice(iuid, 1, {
      ...list[iuid],
      list: listlisy,
    });

    setdataConfig({
      ...dataConfig,
      datasoal: list,
    });

    props.closeCallback();
    toast.success("Berhasil Menambahkan Data Akun", {
      style: {
        minWidth: "250px",
        border: "1px solid #1E40AF",
        padding: "16px",
        color: "#1E40AF",
        marginBottom: "25px",
      },
      success: {
        duration: 3500,
      },
    });
  };
  const prepareData = () => {
    // console.log("rowuid", rowuid);
    const dall = [];
    dataConfig.datasoal.forEach((el) => {
      el.list.forEach((element) => {
        dall.push({ idr: element });
      });
    });
    // uniqBy(dall, "idr");
    // console.log("dall", dall);
    const cc = [...dataConfig.datanilai];
    const nilaiuniq = uniqBy(filter(cc, { key: true }), "idr");
    // console.log("nilaiuniq", nilaiuniq);
    const dif = differenceBy(nilaiuniq, dall, "idr");
    //dif  Belum digunakan
    // console.log("dif", dif);

    return dif;
  };
  //#endregion

  //Pairing
  const dataPair = props.openn && prepareData();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      disableEnforceFocus
      closeAfterTransition={true}
      className={classes.modal}
      open={props.openn}
      onClose={() => {
        props.closeCallback();
      }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.openn}>
        <div className="relative bg-white outline-none rounded-lg w-3/4 max-w-3xl min-h-30v  flex flex-col items-center">
          <div className="relative inset-y-0 top-0 flex flex-row w-full items-center border-b justify-center">
            <h2 className="flex-none text-center font-medium text-2xl py-5">
              Pilih Data Akun Jurnal Penyesuaian
            </h2>
            <div className="absolute inset-y-2 right-2">
              <IconButton onClick={() => props.closeCallback()} size="large">
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className="p-5 flex flex-col w-full mx-auto">
            <div className="relative grow min-h-20v max-h-20v overflow-y-scroll h-36 bg-slate-50 border rounded-sm p-2 px-5 flex flex-col mb-5">
              {dataPair && dataPair.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  Data akun pada jurnal penyesuaian
                  <br /> sudah digunakan semua
                </div>
              ) : (
                dataPair &&
                dataPair.map((el, i) => {
                  const f = find(dataConfig.dataakun, { uid: el.idr });

                  return (
                    <div
                      key={i}
                      onClick={() => pilihDataAkun(el.idr)}
                      className="my-1 p-2 h-10 border rounded bg-white cursor-pointer hover:bg-slate-200  hover:shadow transform hover:scale-102 duration-500"
                    >
                      {f.noakun} - {f.alias}
                    </div>
                  );
                })
              )}
            </div>
            {dataPair.length > 0 && (
              <div className="p-1 bg-red-200 rounded">
                {" "}
                *Catatan: {dataPair.length} Data akun Belum ditampilkan di soal
              </div>
            )}
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
