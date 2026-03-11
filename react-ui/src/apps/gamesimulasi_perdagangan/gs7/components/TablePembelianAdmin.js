import React, {forwardRef} from 'react'
import makeStyles from '@mui/styles/makeStyles';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { InputGrowUpTextH1 } from "../../../gamesimulasi_perdagangan/componentglobal/InputGrowUpTextH";
import { filter, findIndex, includes, remove } from "lodash";
import { v4 as uuidv4 } from "uuid";
import MenuDelete from "../../componentglobal/MenuDelete";

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

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
}) 

const useStyles = makeStyles((theme) => ({}));

function Table(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig, jenisJurnal } = props;

  const handleInputChange = (e, uid) => {
    const { name, value } = e.target;
    const index = findIndex(dataConfig.datajurnal, { uid: uid });
    const list = [...dataConfig.datajurnal];
    list[index][name] = value;
    setdataConfig({ ...dataConfig, datajurnal: list });
  };

  const handleRemoveItemSoal = (idx) => {
    // assigning the list to temp variable
    const temp = [...dataConfig.datajurnal];
    const index = findIndex(dataConfig.datajurnal, { uid: idx });
    // removing the element using splice
    temp.splice(index, 1);

    const deleteAkun = [...dataConfig.dataakun].map(item => {
      const tempakun = [...item.idakun]
      if(remove(tempakun, (x) => x === idx)) {
        return {
          ...item,
          idakun: tempakun
        };
      } else {
          return item
        };
      });
     
      // updating the list
     props.setdataConfig({
       ...dataConfig,
       datajurnal: temp,
       dataakun: deleteAkun
     });  };

  const addRowBarang = () => {
    const newuid = uuidv4();
    const jurnalbaru = {
      id_config: 1,
      uid: newuid, //to ezy edit in FE
      tgl: "",
      keterangan: "",
      no: "",
      persediaan: 2000,
      ppnmasukan: 0,
      hutangdagang: 0,
      kas: 0,
      type: "jurnal pembelian",
    }
    const dict = ["persediaan", "ppnmasukan", "hutangdagang"];

    const listNewAkun = [...dataConfig.dataakun].map(item => {
      if(includes(dict, item.name)) {
        return {
          ...item,
          idakun: [...item.idakun, newuid]
        };
      } else {
        return item
      };
    });

    setdataConfig({
      ...dataConfig,
      datajurnal: [...dataConfig.datajurnal, jurnalbaru],
      dataakun: listNewAkun
    });
  };

  const Ppersediaan = dataConfig && filter(dataConfig.datajurnal, { type: "jurnal pembelian" }).map((item) => parseInt(item.persediaan));
  const Pppnmasukan = dataConfig && filter(dataConfig.datajurnal, { type: "jurnal pembelian" }).map((item) => parseInt(item.persediaan/10));
  const Phutangdagang = dataConfig && filter(dataConfig.datajurnal, { type: "jurnal pembelian" }).map((item) => parseInt(item.persediaan) + parseInt(item.persediaan/10));
  const total = (data) => data && data.reduce((saldoAwal, saldoAkhir) => saldoAwal + saldoAkhir, 0);

  return (
    <div className="relative mt-10">
      <div className="flex flex-col items-center font-bold">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            className={"font-semibold"}
            onChange={(text) => setdataConfig({ ...dataConfig, cvname: text })}
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-lg font-semibold relative uppercase">
          Jurnal Pembelian
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            className={"font-semibold tracking-wider"}
            value={dataConfig ? dataConfig.tblworkname : ""}
            onChange={(text) =>
              setdataConfig({ ...dataConfig, tblworkname: text })
            }
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
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
                  {jenisJurnal === "KAS KELUAR" ? "Kas" : "Hutang Dagang"}
                </th>
              </tr>
              <tr>
                {
                  ["115", "116", "210"].map((item, index) => (
                    <th key={index} className="min-w-10v max-w-10v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      {item}
                    </th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                filter(dataConfig.datajurnal, { type: "jurnal pembelian" }).map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                  >
                    <td className="lg:w-auto  text-slate-800 text-center border border-b">
                      <div className="relative">
                      <div className="absolute z-50 inset-y-0 left-0 flex items-center">
                          <MenuDelete
                            index={item.uid}
                            removeButton={(id) => handleRemoveItemSoal(id)}
                          />
                      </div>
                        <TextField
                          fullWidth
                          multiline
                          className={classes.inpputKeperluan}
                          placeholder="Tanggal"
                          value={item.tgl}
                          onChange={(e) => handleInputChange(e, item.uid)}
                          name="tgl"
                          inputProps={{
                            style: {
                              textAlign: "center",
                              fontSize: "14px"
                            },
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                        />
                      </div>
                    </td>
                    <td className="lg:w-auto px-1 py-2 text-slate-800 text-left border border-b">
                      <div className="relative">
                        <TextField
                          fullWidth
                          multiline
                          className={classes.inpputKeperluan}
                          placeholder="Keterangan"
                          value={item.keterangan}
                          onChange={(e) => handleInputChange(e, item.uid)}
                          name="keterangan"
                          inputProps={{
                            style: {
                              textAlign: "left",
                              paddingLeft: 5,
                              fontSize: "14px"
                            },
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                        />
                      </div>
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      <div className="relative">
                        <TextField
                          fullWidth
                          multiline
                          className={classes.inpputKeperluan}
                          placeholder="number"
                          value={item.no}
                          onChange={(e) => handleInputChange(e, item.uid)}
                          name="no"
                          inputProps={{
                            style: {
                              textAlign: "center",
                              fontSize: "14px"
                            },
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                        />
                      </div>
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      <div className="relative">
                          <TextField
                            fullWidth
                            multiline
                            className={classes.inpputKeperluan}
                            placeholder="Persediaan"
                            value={item.persediaan}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="persediaan"
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      {/* {numberFormat(item.jumlah)} {item.persediaan} */}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {/* <div className="relative">
                          <TextField
                            fullWidth
                            multiline
                            className={classes.inpputKeperluan}
                            placeholder="ppn"
                            value={item.ppnmasukan}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="ppnmasukan"
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                              style: {
                                textAlign: "center",
                                fontSize: "14px"
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                      </div> */}
                      <div className="relative">
                          <TextField
                            fullWidth
                            multiline
                            className={classes.inpputKeperluan}
                            placeholder="Ppn Masukan"
                            value={item.ppnmasukan}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="ppnmasukan"
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      {/* {numberFormat(item.persediaan / 10)} */}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                          <TextField
                            fullWidth
                            multiline
                            className={classes.inpputKeperluan}
                            placeholder="Hutang Dagang"
                            value={item.hutangdagang}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="hutangdagang"
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              style: {
                                fontSize: 14,
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      {/* {numberFormat(parseInt(item.persediaan) + parseInt(item.persediaan/10))} */}
                      {/* <div className="relative">
                        <TextField
                            fullWidth
                            multiline
                            className={classes.inpputKeperluan}
                            placeholder="hutang dagang"
                            value={item.hutangdagang}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="hutangdagang"
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                              style: {
                                textAlign: "center",
                                fontSize: "14px"
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                      </div> */}
                    </td>
                  </tr>
                ))}
                <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                    <td className="lg:w-auto px-1 py-5  text-slate-800 text-center border border-b"></td>
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
                
              </tr>
              
            </tfoot>
          </table>
          <div className="col-span-2 py-2 px-3 w-full border text-left flex justify-between flex-row items-center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.btnadd}
            startIcon={<LibraryAddIcon />}
            onClick={() => addRowBarang()}
          >
            Tambah
          </Button>
          <Button
            className={classes.btnresetsoal}
            onClick={() => {
              const temp = [...dataConfig.datajurnal];
              temp.filter(x => x.type === 'jurnal pembelian').forEach(x => temp.splice(temp.indexOf(x), 1));
              setdataConfig({
                ...dataConfig,
                datajurnal: temp
              })
            }}
          >
            Hapus semua
          </Button>
        </div>
          
        </div>
      </>
    </div>
  );
}

export default Table;
