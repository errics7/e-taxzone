// import { makeStyles } from "@mui/material/styles";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";

import NumberFormat from "react-number-format";
// import EditIcon from "@mui/icons-material/Edit";
// import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
// import { InputGrowUpTextH1 } from "../../../gamesimulasi_perdagangan/componentglobal/InputGrowUpTextH";
import { filter } from "lodash";
// import MenuDelete from "../../componentglobal/MenuDelete";

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

// const useStyles = makeStyles((theme) => ({}));

function TableMhs7(props) {
  // const classes = useStyles();
  const { dataConfig, jenisJurnal } = props;

  const Ppersediaan = dataConfig && filter(dataConfig.datajurnal, { type: "jurnal pembelian" }).map((item) => item.persediaan);
  const Pppnmasukan = dataConfig && filter(dataConfig.datajurnal, { type: "jurnal pembelian" }).map((item) => item.ppnmasukan);
  const Phutangdagang = dataConfig && filter(dataConfig.datajurnal, { type: "jurnal pembelian" }).map((item) => item.hutangdagang);

  const Kpersediaan = dataConfig && filter(dataConfig.datajurnal, { type: "jurnal kas keluar" }).map((item) => item.persediaan);
  const Kppnmasukan = dataConfig && filter(dataConfig.datajurnal, { type: "jurnal kas keluar" }).map((item) => item.ppnmasukan);
  const Khutangdagang = dataConfig && filter(dataConfig.datajurnal, { type: "jurnal kas keluar" }).map((item) => item.kas);

  const total = (data) => data && data.reduce((saldoAwal, saldoAkhir) => saldoAwal + saldoAkhir, 0);

//   const handleInputChange = (e, index) => {
//     const { name, value } = e.target;
//     const list = [...dataConfig.datainvoice];
//     list[index][name] = value;
//     setdataConfig({ ...dataConfig, datainvoice: list });
//   };

//   const handleRemoveItemSoal = (idx) => {
//     // assigning the list to temp variable
//     // const temp = [...dataConfig.databarang];
//     // removing the element using splice
//     // temp.splice(idx, 1);
//     // updating the list
//     // props.setdataConfig({
//     //   ...dataConfig,
//     //   databarang: temp,
//     // });
//   };

  return (
    <div className="relative mt-5">
      <div className="flex flex-col items-center text-lg font-bold relative uppercase">
        {dataConfig && dataConfig.cvname}
      </div>
      <div className="flex flex-col items-center">
        <div className="text-lg font-bold relative uppercase">
          {jenisJurnal}
        </div>
      </div>
      <div className="flex flex-col items-center text-lg font-bold relative uppercase">
        {dataConfig && dataConfig.tblworkname}
      </div>
      <>
        <div className="mt-3 overflow-x-auto border-collapse border">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th
                  rowSpan="3"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal
                </th>
                <th
                  rowSpan="3"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keterangan (Nama Pemasok)
                </th>
                <th
                  rowSpan="3"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No Faktur
                </th>
                <th
                  colSpan="2"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Debet
                </th>
                <th
                  colSpan="3"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Kredit
                </th>
              </tr>
              <tr>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Persediaan
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  PPN Masukan
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  {
                    jenisJurnal === "jurnal pembelian" ? "Hutang Dagang" : "Kas"
                  }
                </th>
              </tr>
              <tr>
              {
                jenisJurnal === "jurnal pembelian" ? 
                [115, 116, 210].map((item, i) => (
                  <th key={i} className="min-w-10v max-w-10v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    {item}
                  </th>
                )) :
                [115, 116, 110].map((item, i) => (
                  <th key={i} className="min-w-10v max-w-10v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    {item}
                  </th>
                ))
              }
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                filter(dataConfig.datajurnal, { type: jenisJurnal }).map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                  >
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                     {item.tgl}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {item.keterangan}
                    </td>
                    <td className="lg:w-auto px-1 py-2 capitalize text-slate-800 text-center border border-b">
                      {item.type}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {numberFormat(item.persediaan)}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {numberFormat(item.ppnmasukan)}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "jurnal pembelian" ? numberFormat(item.hutangdagang) : numberFormat(item.kas)}
                    </td>
                  </tr>
                ))} 
                <tr>
                    <td className="lg:w-auto px-1 py-4 text-slate-800 text-center border border-b"></td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                </tr>
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="3"
                  className="px-10 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-right"
                >
                  Jumlah
                </td>
                {
                 jenisJurnal === "jurnal pembelian" ? 
                 <>
                    <th
                      className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                    >
                        {numberFormat(total(Ppersediaan))}
                    </th>
                    <th
                        className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                    >
                        {numberFormat(total(Pppnmasukan))}
                    </th>
                    <th
                        className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                    >
                         {numberFormat(total(Phutangdagang))}
                    </th>
                 </> :
                 <>
                  <th
                      className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                    >
                        {numberFormat(total(Kpersediaan))}
                    </th>
                    <th
                        className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                    >
                        {numberFormat(total(Kppnmasukan))}
                    </th>
                    <th
                        className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                    >
                         {numberFormat(total(Khutangdagang))}
                    </th>
                 </>
                }
               
                
                {/* {[
                  "persediaan",
                  "ppnmasukan",
                  "hutangdagang"
                ].map((item, index) => {
                  const dat = find(dataConfig.dataakun, { name: item });
                  return (
                    <th
                      key={index}
                      className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                    >
                      {dat && numberFormat(dat.jumlah)}
                    </th>
                  );
                })} */}
                {/* <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "jumlah"))}
                </td>
                <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "hpp"))}
                </td>
                <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "subtotal"))}
                </td>
                <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "ppn"))}
                </td>
                <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "persediaan"))}
                </td> */}
              </tr>
              
            </tfoot>
          </table>  
        </div>
      </>
    </div>
  );
}

export default TableMhs7;
