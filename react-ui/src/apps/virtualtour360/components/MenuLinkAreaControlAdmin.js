import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clean } from "../../../redux/configSlice";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import makeStyles from "@mui/styles/makeStyles";
import { find, findIndex, remove } from "lodash";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import toast from "react-hot-toast";

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

function MenuLinkAreaControlAdmin(props) {
  const classes = useStyles();
  const { selectedid, menu, dataInfo, setDataInfo } = props;
  const dispatch = useDispatch();
  const cfg = useSelector((state) => state.config);
  const data = find(dataInfo, { uid: cfg.data.uid });

  const removeInfo = () => {
    const list = [...dataInfo];
    remove(list, { uid: cfg.data.uid });
    setDataInfo(list);
  };

  const onChangeTarget = (id) => {
    const list = [...dataInfo];
    const idx = findIndex(dataInfo, { uid: cfg.data.uid });
    list.splice(idx, 1, { ...list[idx], to_id: id });

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
        Detail Link Pindah Area
      </h1>
      <div className="mx-3 flex flex-col">
        <p className="pt-3 pb-2">
          Pilih Area untuk pindah : (terpilih -{" "}
          {find(menu, { id: data?.to_id })?.name})
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-3 max-h-52 overflow-y-scroll mb-3">
          {menu &&
            menu.map((item, i) => {
              const now = Number(selectedid) === Number(item.id);
              const select = Number(data.to_id) === Number(item.id);

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (now) {
                      toast.error("Tidak bisa pindah di area yang sama");
                    } else {
                      toast.success("Target area berhasil diatur");
                      onChangeTarget(Number(item.id));
                    }
                  }}
                  className={`relative group bg-white border min-h-15v rounded shadow flex flex-col border-t bg-gradient-to-t from-blue-500 ${
                    now && " cursor-not-allowed"
                  }  ${
                    !now &&
                    "cursor-pointer hover:scale-102 transition-all hover:shadow-lg"
                  }`}
                >
                  {now && (
                    <span className="absolute top-2 left-2 bg bg-slate-600 py-0.5 px-2 rounded text-xs text-white">
                      sekarang
                    </span>
                  )}
                  {select && (
                    <span className="absolute top-2 left-2 bg bg-red-500 py-0.5 px-2 rounded text-xs text-white">
                      ->Target Area
                    </span>
                  )}
                  <ThreeDRotationIcon className="absolute right-2 top-2 text-white" />
                  <div className="absolute inset-x-0 bottom-1 h-1/3 z-50 px-5 text-white truncate text-1xl lg:text-1xl">
                    {item.name}
                  </div>
                </div>
              );
            })}
        </div>
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

export default MenuLinkAreaControlAdmin;
