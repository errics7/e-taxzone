//#region
import React from "react"; 
import makeStyles from "@mui/styles/makeStyles";
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnsave: {
    marginBottom: "25px",
    textTransform: "capitalize",
    backgroundColor: "#2D90DA",
  },
  btncancel: {
    marginBottom: "25px",
    textTransform: "capitalize",
    marginRight: "10px",
  },
  btndel: {
    marginBottom: "25px",
    textTransform: "capitalize",
  },
}));
//#endregion

export default function ModalNewSkenario({ open, handleClose }) {
  const classes = useStyles();

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="z-50 bg-white rounded w-3/4 lg:w-2/4 flex flex-col items-center">
            <div className="relative flex w-full items-center">
              <h2 className="w-full text-center text-2xl pt-5 pb-2 border-b">
                Data Mahasiswa
              </h2>
              <div className="absolute inset-y-0 right-0 pt-2">
                <IconButton onClick={handleClose} size="large">
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div className="p-5 flex w-full min-h-50v">
              <div className="w-6/12 pl-2 pr-2">
                <h1>Pie Chard</h1>
              </div>
              <div className="w-6/12 pr-2">
                <div class="flex justify-end">
                  <div class="mb-3 max-w-xs justify-end">
                    <input
                      type="search"
                      class="
                        form-control
                        block
                        w-full
                        px-3
                        py-1.5
                        text-base
                        font-normal
                        text-gray-700
                        bg-white bg-clip-padding
                        border border-solid border-gray-300
                        rounded
                        transition
                        ease-in-out
                        m-0
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                      "
                      placeholder="search"
                    />
                  </div>
                </div>
                <table className="border-collapse min-w-full table-fixed">
                  <thead>
                    <tr>
                      <th className="min-w-30v font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
                        Nama
                      </th>
                      <th className="min-w-20v font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
                        Kelas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 text-center border border-slate-300 table-cell">
                        Naufal Yukafi Ridlo
                      </td>
                      <td className="p-2 text-center border border-slate-300 table-cell">
                        TI3D
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 text-center border border-slate-300 table-cell">
                        Naufal Yukafi Ridlo
                      </td>
                      <td className="p-2 text-center border border-slate-300 table-cell">
                        TI3D
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 text-center border border-slate-300 table-cell">
                        Naufal Yukafi Ridlo
                      </td>
                      <td className="p-2 text-center border border-slate-300 table-cell">
                        TI3D
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
