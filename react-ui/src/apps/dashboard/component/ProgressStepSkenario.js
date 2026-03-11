import React from "react";

function ProgressStepSkenario({ posisi }) {
  return (
    <div className="my-4">
      <div className="flex pb-3">
        <div className="flex-1 text-center">
          <div
            className="mx-auto font-bold text-lg text-white rounded-full bg-sky-600 border-2 border-blue-500 flex items-center justify-center"
            style={{ height: "38px", width: "38px" }}
          >
            1
          </div>
          <p className={`pt-1 text-sm ${posisi >= 1 && "text-sky-600"}`}>
            informasi
          </p>
        </div>

        <div className="w-1/3 align-center items-center align-middle content-center flex">
          <div
            className={`w-full h-2 border border-blue-100 ${posisi > 1 && "bg-blue-400"
              } rounded-full items-center align-middle align-center flex-1`}
          >
            &nbsp;
          </div>
        </div>


        <div className="flex-1">
          <div
            className={`h-10 mx-auto text-lg text-white flex items-center relative`}
          >
            <span
              className={`${posisi > 1 ? "text-blue-500 z-50 outline-2" : "text-blue-200"
                } text-center w-full`}
            >
              Finish
            </span>
            {posisi > 1 && (
              <div
                className="inline-block absolute inset-0 mx-auto bg-blue-100 border border-blue-200 rounded-full"
                style={{ height: "38px", width: "38px" }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressStepSkenario;
