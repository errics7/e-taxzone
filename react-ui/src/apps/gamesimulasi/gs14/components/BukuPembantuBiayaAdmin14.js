import Tooltip from "@mui/material/Tooltip";

import IconButton from "@mui/material/IconButton";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ListBukuPembantuBiayaAdmin14 from "./ListBukuPembantuBiayaAdmin14";

export default function BukuPembantuBiayaAdmin14(props) {
  const alokasi = props.alokasi;
  const listPembantu = props.listPembantu;

  return (
    <div className="border min-h-25v bg-white">
      <div className="relative">
        <div className="opacity-50 italic font-semibold my-1 px-1">
          Editor Worksheet:
        </div>
        <div className="absolute inset-y-0 right-0 z-50 transform hover:scale-x-125">
          <Tooltip
            title={
              props.sizeCon === 12
                ? "Perkecil ukuran Buku Pembantu"
                : "Perbesar ukuran Buku Pembantu"
            }
            arrow
            placement="top"
          >
            {props.sizeCon === 12 ? (
              <IconButton onClick={() => props.setSizeCon(6)} size="small">
                <FullscreenExitIcon fontSize="inherit" />
              </IconButton>
            ) : (
              <IconButton onClick={() => props.setSizeCon(12)} size="small">
                <FullscreenIcon fontSize="inherit" />
              </IconButton>
            )}
          </Tooltip>
        </div>
      </div>
      {alokasi.map((item, index) => {
        return (
          <div key={index}>
            <ListBukuPembantuBiayaAdmin14
              item={item}
              listPembantu={listPembantu}
              setListPembantu={(x) => props.setListPembantu(x)}
              alokasi={alokasi}
              setAlokasi={(x) => props.setAlokasi(x)}
            />
          </div>
        );
      })}
    </div>
  );
}
