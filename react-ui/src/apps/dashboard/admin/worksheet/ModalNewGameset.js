import React, {   useState } from "react";
//import { AuthContext } from "../../../../AppRoute";

import makeStyles from '@mui/styles/makeStyles';
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";

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
}));

function ModalNewGameset(props) {
  const classes = useStyles();
  // const { dispatch } = useContext(AuthContext);

  const [load, setLoad] = useState(false);
  const [name, setName] = useState("");
  // const [gs1, setGs1] = useState(false);
  // const [gs2, setGs2] = useState(false);
  // const [gs3, setGs3] = useState(false);
  // const [gs4, setGs4] = useState(false);
  // const [gs5, setGs5] = useState(false);
  // const [gs6, setGs6] = useState(false);
  // const [gs7, setGs7] = useState(false);
  // const [gs8, setGs8] = useState(false);
  // const [gs9, setGs9] = useState(false);
  // const [gs10, setGs10] = useState(false);
  // const [gs11, setGs11] = useState(false);
  // const [gs12, setGs12] = useState(false);
  // const [gs13, setGs13] = useState(false);
  // const [gs14, setGs14] = useState(false);
  // const [gs15, setGs15] = useState(false);
  // const [gs16, setGs16] = useState(false);
  // const [gs17, setGs17] = useState(false);
  // const [gs18, setGs18] = useState(false);
  //Perdagangan
  const [perdagangan1, setPerdagangan1] = useState(false);
  const [perdagangan2, setPerdagangan2] = useState(false);
  const [perdagangan3, setPerdagangan3] = useState(false);
  const [perdagangan4, setPerdagangan4] = useState(false);
  const [perdagangan5, setPerdagangan5] = useState(false);
  const [perdagangan6, setPerdagangan6] = useState(false);
  const [perdagangan7, setPerdagangan7] = useState(false);
  const [perdagangan8, setPerdagangan8] = useState(false);
  const [perdagangan9, setPerdagangan9] = useState(false);
  const [perdagangan10, setPerdagangan10] = useState(false);
  const [perdagangan11, setPerdagangan11] = useState(false);
  const [perdagangan12, setPerdagangan12] = useState(false);
  const [perdagangan13, setPerdagangan13] = useState(false);
  const [perdagangan14, setPerdagangan14] = useState(false);
  const [perdagangan15, setPerdagangan15] = useState(false);
  const [perdagangan16, setPerdagangan16] = useState(false);
  const [perdagangan17, setPerdagangan17] = useState(false);

  const gamelist = [
    {
      name: "perdagangan1",
      defname: "Game Simulasi 1",
      desc: "Game Simulasi Perdagangan 1 ...",
      avail: true, //Tersedia
      val: perdagangan1,
      func: function () {
        setPerdagangan1(!perdagangan1);
      },
    },
    {
      name: "perdagangan2",
      defname: "Game Simulasi 2",
      desc: "Game Simulasi Perdagangan 2 ...",
      avail: true, //Tersedia
      val: perdagangan2,
      func: function () {
        setPerdagangan2(!perdagangan2);
      },
    },
    {
      name: "perdagangan3",
      defname: "Game Simulasi 3",
      desc: "Game Simulasi Perdagangan 3 ...",
      avail: true, //Tersedia
      val: perdagangan3,
      func: function () {
        setPerdagangan3(!perdagangan3);
      },
    },
    {
      name: "perdagangan4",
      defname: "Game Simulasi 4",
      desc: "Game Simulasi Perdagangan 4 ...",
      avail: true, //Tersedia
      val: perdagangan4,
      func: function () {
        setPerdagangan4(!perdagangan4);
      },
    },
    {
      name: "perdagangan5",
      defname: "Game Simulasi 5",
      desc: "Game Simulasi Perdagangan 5 ...",
      avail: true, //Tersedia
      val: perdagangan5,
      func: function () {
        setPerdagangan5(!perdagangan5);
      },
    },
    {
      name: "perdagangan6",
      defname: "Game Simulasi 6",
      desc: "Game Simulasi Perdagangan 6 ...",
      avail: true, //Tersedia
      val: perdagangan6,
      func: function () {
        setPerdagangan6(!perdagangan6);
      },
    },
    {
      name: "perdagangan7",
      defname: "Game Simulasi 7",
      desc: "Game Simulasi Perdagangan 7 ...",
      avail: true, //Tersedia
      val: perdagangan7,
      func: function () {
        setPerdagangan7(!perdagangan7);
      },
    },
    {
      name: "perdagangan8",
      defname: "Game Simulasi 8",
      desc: "Game Simulasi Perdagangan 8 ...",
      avail: true, //Tersedia
      val: perdagangan8,
      func: function () {
        setPerdagangan8(!perdagangan8);
      },
    },
    {
      name: "perdagangan9",
      defname: "Game Simulasi 9",
      desc: "Game Simulasi Perdagangan 9 ...",
      avail: true, //Tersedia
      val: perdagangan9,
      func: function () {
        setPerdagangan9(!perdagangan9);
      },
    },
    {
      name: "perdagangan10",
      defname: "Game Simulasi 10",
      desc: "Game Simulasi Perdagangan 10 ...",
      avail: true, //Tersedia
      val: perdagangan10,
      func: function () {
        setPerdagangan10(!perdagangan10);
      },
    },
    {
      name: "perdagangan11",
      defname: "Game Simulasi 11",
      desc: "Game Simulasi Perdagangan 11 ...",
      avail: true, //Tersedia
      val: perdagangan11,
      func: function () {
        setPerdagangan11(!perdagangan11);
      },
    },
    {
      name: "perdagangan12",
      defname: "Game Simulasi 12",
      desc: "Game Simulasi Perdagangan 12 ...",
      avail: true, //Tersedia
      val: perdagangan12,
      func: function () {
        setPerdagangan12(!perdagangan12);
      },
    },
    {
      name: "perdagangan13",
      defname: "Game Simulasi 13",
      desc: "Game Simulasi Perdagangan 13 ...",
      avail: true, //Tersedia
      val: perdagangan13,
      func: function () {
        setPerdagangan13(!perdagangan13);
      },
    },
    {
      name: "perdagangan14",
      defname: "Game Simulasi 14",
      desc: "Game Simulasi Perdagangan 14 ...",
      avail: true, //Tersedia
      val: perdagangan14,
      func: function () {
        setPerdagangan14(!perdagangan14);
      },
    },
    {
      name: "perdagangan15",
      defname: "Game Simulasi 15",
      desc: "Game Simulasi Perdagangan 15 ...",
      avail: true, //Tersedia
      val: perdagangan15,
      func: function () {
        setPerdagangan15(!perdagangan15);
      },
    },
    {
      name: "perdagangan16",
      defname: "Game Simulasi 16",
      desc: "Game Simulasi Perdagangan 16 ...",
      avail: true, //Tersedia
      val: perdagangan16,
      func: function () {
        setPerdagangan16(!perdagangan16);
      },
    },
    {
      name: "perdagangan17",
      defname: "Game Simulasi 17",
      desc: "Game Simulasi Perdagangan 17 ...",
      avail: true, //Tersedia
      val: perdagangan17,
      func: function () {
        setPerdagangan17(!perdagangan17);
      },
    },
    // {
    //   name: "gs1",
    //   defname: "Game Simulasi 1",
    //   desc: "Game .....",
    //   avail: false,
    //   val: gs1,
    //   func: function () {
    //     setGs1(!gs1);
    //     console.log("clicked gs1");
    //   },
    // },
    // {
    //   name: "gs2",
    //   defname: "Game Simulasi 2",
    //   desc: "Game .....",
    //   avail: false,
    //   val: gs2,
    //   func: function () {
    //     setGs2(!gs2);
    //     console.log("clicked gs2");
    //   },
    // },
    // {
    //   name: "gs3",
    //   defname: "Game Simulasi 3",
    //   desc: "Game .....",
    //   avail: false,
    //   val: gs3,
    //   func: function () {
    //     setGs3(!gs3);
    //     console.log("clicked gs3");
    //   },
    // },
    // {
    //   name: "gs4",
    //   defname: "Game Simulasi 4",
    //   desc: "Game .....",
    //   avail: false,
    //   val: gs4,
    //   func: function () {
    //     setGs4(!gs4);
    //     console.log("clicked gs4");
    //   },
    // },
    // {
    //   name: "gs5",
    //   defname: "Game Simulasi 5",
    //   desc: "Game .....",
    //   avail: false,
    //   val: gs5,
    //   func: function () {
    //     setGs5(!gs5);
    //     console.log("clicked gs5");
    //   },
    // },
    // {
    //   name: "gs6",
    //   defname: "Game Simulasi 6",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs6,
    //   func: function () {
    //     setGs6(!gs6);
    //     console.log("clicked gs6");
    //   },
    // },
    // {
    //   name: "gs7",
    //   defname: "Game Simulasi 7",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs7,
    //   func: function () {
    //     setGs7(!gs7);
    //     console.log("clicked gs7");
    //   },
    // },
    // {
    //   name: "gs8",
    //   defname: "Game Simulasi 8",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs8,
    //   func: function () {
    //     setGs8(!gs8);
    //     console.log("clicked gs8");
    //   },
    // },
    // {
    //   name: "gs9",
    //   defname: "Game Simulasi 9",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs9,
    //   func: function () {
    //     setGs9(!gs9);
    //     console.log("clicked gs9");
    //   },
    // },
    // {
    //   name: "gs10",
    //   defname: "Game Simulasi 10",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs10,
    //   func: function () {
    //     setGs10(!gs10);
    //     console.log("clicked gs10");
    //   },
    // },
    // {
    //   name: "gs11",
    //   defname: "Game Simulasi 11",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs11,
    //   func: function () {
    //     setGs11(!gs11);
    //     console.log("clicked gs11");
    //   },
    // },
    // {
    //   name: "gs12",
    //   defname: "Game Simulasi 12",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs12,
    //   func: function () {
    //     setGs12(!gs12);
    //     console.log("clicked gs12");
    //   },
    // },
    // {
    //   name: "gs13",
    //   defname: "Game Simulasi 13",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs13,
    //   func: function () {
    //     setGs13(!gs13);
    //     console.log("clicked gs13");
    //   },
    // },
    // {
    //   name: "gs14",
    //   defname: "Game Simulasi 14",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs14,
    //   func: function () {
    //     setGs14(!gs14);
    //     console.log("clicked gs14");
    //   },
    // },
    // {
    //   name: "gs15",
    //   defname: "Game Simulasi 15",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs15,
    //   func: function () {
    //     setGs15(!gs15);
    //     console.log("clicked gs15");
    //   },
    // },
    // {
    //   name: "gs16",
    //   defname: "Game Simulasi 16",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs16,
    //   func: function () {
    //     setGs16(!gs16);
    //     console.log("clicked gs16");
    //   },
    // },
    // {
    //   name: "gs17",
    //   defname: "Game Simulasi 17",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs17,
    //   func: function () {
    //     setGs17(!gs17);
    //     console.log("clicked gs17");
    //   },
    // },
    // {
    //   name: "gs18",
    //   defname: "Game Simulasi 18",
    //   desc: "Game .....",
    //   avail: false, //Tersedia
    //   val: gs18,
    //   func: function () {
    //     setGs18(!gs18);
    //     console.log("clicked gs18");
    //   },
    // },
  ];

  const newWorkSheet = () => {
    if (load) return;
    if (name.length < 1) {
      toast.error("Nama Tidak Boleh Kosong");
      return;
    }
    setLoad(true);
    //

    const push = axios.post(
      `${API.HOST}/api/v1/worksheet/new`,
      {
        name: name,
        list: gamelist,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    // Notif
    toast.promise(
      push,
      {
        loading: "Saving Data...",
        success: (data) => {
          setLoad(false);
          props.update();
          props.close();
          // message
          console.log(data);
          return data.data.message;
        },
        error: (error) => {
          setLoad(false);

          if (error.response.status === 401) {
            // dispatch({ type: "LOGOUT" });
          }
          // return <b>{error.response.data.message}</b>;
          console.log(error);
          return "err";
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
          duration: 3500,
        },
      }
    );
  };

  return <>
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.open}
      onClose={() => {
        if (load) return;
        props.close();
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className="z-50 bg-white rounded w-3/4 min-h-1/2 max-h-full my-10 flex flex-col items-center">
          <div className="relative flex w-full items-center">
            <h2 className="w-full text-center text-2xl pt-5 pb-2 border-b">
              Worksheet Baru
            </h2>
            <div className="absolute inset-y-0 right-0 pt-2">
              <IconButton
                onClick={() => {
                  if (load) return;
                  props.close();
                }}
                size="large">
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className="p-5 flex flex-col w-full">
            <TextField
              label="Nama Worksheet"
              style={{ marginTop: 0, marginBottom: "10px", maxWidth: "50%" }}
              placeholder="beri nama worksheet"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <div className="p-3 grow bg-slate-100 rounded-md">
              <Grid
                container
                spacing={2}
                className="relative max-h-96 overflow-y-scroll"
              >
                {gamelist.map((data, index) => {
                  return (
                    <Grid key={index} item xs={12} md={4} lg={3}>
                      <div
                        className={`bg-white h-40 px-2 rounded shadow hover:shadow-lg flex flex-col border-t relative ${
                          !data.avail && "filter blur-xs"
                        }`}
                      >
                        <FormControlLabel
                          value="start"
                          control={
                            <Checkbox
                              color="primary"
                              checked={data.val}
                              onChange={data.func}
                              disabled={!data.avail}
                            />
                          }
                          label="Active"
                          labelPlacement="start"
                          // className={!data.avail && "filter blur-xs"}
                        />
                        <div className="flex items-end grow pb-3">
                          <div className="flex-col">
                            <h2 className="text-xl pt-3">{data.defname}</h2>
                            <p>{data.desc}</p>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            className={classes.btnsave}
            onClick={() => newWorkSheet()}
          >
            Buat Worksheet
          </Button>
        </div>
      </Fade>
    </Modal>
  </>;
}

export default ModalNewGameset;
