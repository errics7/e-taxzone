import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function EditorNarasiNote() {
  const [show, setShow] = useState(false);

  return (
    <div className="w-1/2 px-2">
      <div
        className={`bg-amber-100 inline-flex px-2 mb-2  ${
          show && "bg-amber-100 mb-2 p-2"
        } rounded text-sm text-amber-700`}
        role="alert"
      >
        <div className="">
          <div className="flex w-full justify-between">
            <span className="font-medium cursor-pointer" onClick={() => setShow(!show)}>
              Info{" "}
              <svg
                className="w-4 h-4 inline mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
            {show && (
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => setShow(!show)}
              >
                <CloseIcon fontSize="inherit" className="text-red-500" />
              </IconButton>
            )}
          </div>
          <div className={`${!show && "hidden"}`}>
            - untuk pindah baris gunakan shift+enter
          </div>
        </div>
      </div>
    </div>
  );
}
