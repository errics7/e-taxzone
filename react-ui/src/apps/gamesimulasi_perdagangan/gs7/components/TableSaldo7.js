import React from 'react'
// import { TextareaAutosize } from "@mui/material";
import NumberFormat from "react-number-format";
// import EditIcon from "@mui/icons-material/Edit";
// import PropTypes from "prop-types";
import { find } from "lodash";
// import { filter, groupBy, map } from "lodash";


const numberFormat = (number) => {
  return (
      <NumberFormat
          value={number}
          displayType={"text"}
          thousandSeparator="."
          decimalSeparator=","
          isNumericString
          prefix="Rp "
          renderText={(value, props) => <div {...props}>{value}</div>}
      />
  );
};


function TableSaldo7(props) {
  const { dataConfig } = props;

  return (
    <div>
      <div className="font-semibold">Data Saldo</div>
      <div className="mt-2 mb-2 relative">
        Berikut ini merupakan data saldo:
      </div>
      <div className="mt-0 overflow-x-auto border-collapse">
      <table className="border-collapse table-fixed">
        <thead>
          <tr>
            <th className="min-w-20v max-w-15v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Nama Akun
            </th>
            <th className="min-w-10v max-w-10v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Tanggal
            </th>
            <th className="min-w-25v max-w-15v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Ref
            </th>
            <th className="min-w-20v max-w-15v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Jumlah
            </th>
            <th className="min-w-10v max-w-10v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Posisi
            </th>
          </tr>
        </thead>
        {dataConfig && dataConfig.dataakun.map((el, i) => {
          return (
            <tbody key={i}>
              {el.idakun.map((item, index) => {
                const cari = find(dataConfig.datajurnal, { uid: item })
                return (
                  <tr key={index}>
                      {index === 0 && (
                      <td
                        rowSpan={el.idakun.length}
                        className="min-w-15v max-w-15v px-1 py-2 font-semibold text-center capitalize bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        {el.detailname}
                      </td>
                    )}
                      <td className="min-w-15v max-w-15v px-0.5 py-0.5 text-center bg-slate-50 text-slate-600 border border-slate-300">
                        <div
                          className="bg-emerald-500 bg-opacity-40 py-1.5 px-0.5"
                        >
                          {cari && cari.tgl}
                        </div>
                      </td>
                      <td className="min-w-20v max-w-15v px-0.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-300 text-center capitalize">
                        <div
                          className="bg-emerald-500 bg-opacity-40 py-1.5 px-0.5"
                        >
                          {cari && cari.type}
                        </div>
                      </td>
                      <td className="min-w-15v max-w-15v px-0.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-300 text-center">
                        <div
                          className="bg-emerald-500 bg-opacity-40 py-1.5 px-0.5"
                        >
                          {
                            cari && 
                            el.name === "kas" ? cari && (numberFormat(parseInt(cari.persediaan) + parseInt(cari.persediaan/10))):
                            el.name === "persediaan" ? cari && numberFormat(cari.persediaan) :
                            el.name === "ppnmasukan" ? cari && numberFormat(cari.persediaan/10) :
                            el.name === "hutangdagang" && cari && (numberFormat(parseInt(cari.persediaan) + parseInt(cari.persediaan/10)))
                          }
                        </div>
                      </td>
                      <td className="min-w-10v max-w-10v px-1 py-2 bg-slate-50 text-slate-600 border border-slate-300 text-center capitalize">
                        {el.name === "kas" ? "debet" : el.posisi}
                      </td>
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
    </div>
   
    </div>
  );
}

export default TableSaldo7;
