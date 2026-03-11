import React, { forwardRef } from "react";
// import { Button, TextField } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import NumberFormat from "react-number-format";
import { v4 as uuidv4 } from "uuid";
import PopMenuGS11 from "./PopMenuGS11";
import { remove } from "lodash";
import { Button, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";

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

const useStyles = makeStyles((theme) => ({
  btnLihatPreviewMhs: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnback: {
    backgroundColor: "#7C7C7C",
    textTransform: "none",
    marginLeft: "0px",
    marginRight: "10px",
    marginBottom: "10px",
    paddingLeft: "10px",
    paddingRight: "20px",
    "&:hover": {
      backgroundColor: "#5D5D5D",
      boxShadow: "none",
    },
  },
  btnaddadata: {
    color: "#FFF",
    backgroundColor: "#2D90DA",
    "&:hover": {
      backgroundColor: "#216CA3",
      boxShadow: "none",
    },
    textTransform: "capitalize",
  },
}));
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
            value: parseFloat(values.value).toFixed(2),
          },
        });
      }}
      style={{
        textAlign: "center",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

const NotaAkunList = (props) => {
  const classes = useStyles();
  const dataConfig = props.dataConfig;
  const dataAkun = props.dataAkun;
  const dataPosting = props.dataPosting;

  const handleChangeAkun = (e, index) => {
    const { name, value } = e.target;
    const tempDataAkun = [...dataAkun];
    tempDataAkun[index][name] = value;
    props.setDataAkun(tempDataAkun);
  };

  const handleChangeConfig = (e) => {
    const { name, value } = e.target;
    const tempDataConfig = { ...dataConfig };
    tempDataConfig[name] = value;
    props.setDataConfig(tempDataConfig);
  };

  const handleChangePosting = (e, idPosting) => {
    const { name, value } = e.target;
    const tempDataPosting = [...dataPosting];
    const selectedIdx = tempDataPosting.findIndex(
      (posting) => posting.id === idPosting
    );
    tempDataPosting[selectedIdx][name] = value;
    props.setDataPosting(tempDataPosting);
  };

  const handleSaldoAwal = (e, idAkun, idx) => {
    const { name, value } = e.target;
    const tempDataAkun = [...dataAkun];
    const tempDataPosting = [...dataPosting];
    const selectedAkun = [
      ...tempDataAkun.filter((akun) => akun.id_akun === idAkun),
    ];
    selectedAkun[0][name] = Number(value);

    const selectedPosting = tempDataPosting.filter(
      (posting) => posting.id_akun === idAkun
    );

    for (let i = 0; i < selectedPosting.length; i++) {
      if (selectedAkun[0].type_saldo === selectedPosting[i].posisi) {
        if (i === 0) {
          selectedPosting[i].saldototal =
            Number(value) + selectedPosting[i][selectedPosting[i].posisi];
        } else {
          selectedPosting[i].saldototal =
            selectedPosting[i - 1].saldototal +
            selectedPosting[i][selectedPosting[i].posisi];
        }
      } else {
        if (i === 0) {
          selectedPosting[i].saldototal =
            Number(value) - selectedPosting[i][selectedPosting[i].posisi];
        } else {
          selectedPosting[i].saldototal =
            selectedPosting[i - 1].saldototal -
            selectedPosting[i][selectedPosting[i].posisi];
        }
      }

      if (i === selectedPosting.length - 1) {
        selectedAkun[0][`total_${selectedAkun[0].type_saldo}`] =
          selectedPosting[i].saldototal;
      }
    }
    tempDataAkun[idx] = selectedAkun[0];

    // props.setDataAkun([selectedAkun, ...dataAkun]);
    props.setDataAkun(tempDataAkun);
    // props.setDataPosting(...dataPosting, selectedPosting);
  };

  const handlePosting = (e, idPosting, idAkun, idxAkun) => {
    const { name, value } = e.target;
    const tempDataAkun = [...dataAkun];
    const tempDataPosting = [...dataPosting];
    const selectedAkun = [
      ...tempDataAkun.filter((akun) => akun.id_akun === idAkun),
    ];
    const selectedEditPosting = tempDataPosting.filter(
      (posting) => posting.id === idPosting
    );
    const selectedPosting = tempDataPosting.filter(
      (posting) => posting.id_akun === idAkun
    );
    selectedEditPosting[0][name] = Number(value);

    for (let i = 0; i < selectedPosting.length; i++) {
      if (selectedAkun[0].type_saldo === selectedPosting[i].posisi) {
        if (i === 0) {
          selectedPosting[i].saldototal =
            selectedAkun[0].saldo_awal +
            selectedPosting[i][selectedPosting[i].posisi];
        } else {
          selectedPosting[i].saldototal =
            selectedPosting[i - 1].saldototal +
            selectedPosting[i][selectedPosting[i].posisi];
        }
      } else {
        if (i === 0) {
          selectedPosting[i].saldototal =
            selectedAkun[0].saldo_awal -
            selectedPosting[i][selectedPosting[i].posisi];
        } else {
          selectedPosting[i].saldototal =
            selectedPosting[i - 1].saldototal -
            selectedPosting[i][selectedPosting[i].posisi];
        }
      }

      if (i === selectedPosting.length - 1) {
        selectedAkun[0][`total_${selectedAkun[0].type_saldo}`] =
          selectedPosting[i].saldototal;
      }
    }
    tempDataAkun[idxAkun] = selectedAkun[0];
    props.setDataAkun(tempDataAkun);
  };

  const addPosting = (type, id_akun) => {
    const tempDataPosting = [...dataPosting];
    tempDataPosting.push({
      id_akun,
      id: uuidv4(),
      id_config: Number(props.id),
      tgl: "3/12/2021",
      keterangan: "POSTING",
      type: "posting",
      ref: "JURNAL PENJUALAN",
      debet: 0,
      kredit: 0,
      posisi: type,
      saldototal: 0,
    });
    props.setDataPosting(tempDataPosting);
  };

  const removeDataPosting = (id) => {
    const tempDataPosting = [...dataPosting];
    remove(tempDataPosting, (x) => x.id === id);

    props.setDataPosting(tempDataPosting);
  };

  return (
    <div className="border min-h-10v mt-5">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
        Tampilan Data (soal):
      </div>
      <div className="mt-3 px-5 py-6">
        {dataAkun &&
          dataAkun.map((akun, idx) => (
            <div key={idx} className="my-4 border-2 p-4">
              <div className="my-1 ">
                <label className="mr-2">Nama akun &nbsp;&nbsp;&nbsp; :</label>
                <span className="bg-true-emerald-500">
                  <InputGrowUpTextWithName
                    style={`placeholder-gray-200`}
                    icon={true}
                    name="nama"
                    type="text"
                    placeholder="nama akun"
                    index={idx}
                    value={dataAkun ? akun.nama : " "}
                    onChange={(e) => handleChangeAkun(e, idx)}
                  />
                </span>
              </div>
              <div className="my-1">
                <label className="mr-2">No. akun &nbsp;&nbsp;&nbsp; :</label>
                <span className="bg-true-emerald-500">
                  <InputGrowUpTextWithName
                    style={`placeholder-gray-200`}
                    icon={true}
                    name="noakun"
                    type="text"
                    placeholder="nomor akun"
                    index={idx}
                    value={dataAkun ? akun.noakun : " "}
                    onChange={(e) => handleChangeAkun(e, idx)}
                  />
                </span>
              </div>
              <div className="overflow-x-auto border-collapse">
                <table className="border-collapse min-w-full table-fixed">
                  <thead>
                    <tr>
                      <th
                        rowSpan="2"
                        className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        Tanggal
                      </th>
                      <th
                        rowSpan="2"
                        className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        Keterangan
                      </th>
                      <th
                        rowSpan="2"
                        className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        Ref
                      </th>
                      <th
                        rowSpan="2"
                        className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        Debet
                      </th>
                      <th
                        rowSpan="2"
                        className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        Kredit
                      </th>
                      <th
                        colSpan="2"
                        className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        Saldo
                      </th>
                    </tr>
                    <tr>
                      <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                        Debet
                      </th>
                      <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                        Kredit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-t border-gray-300 ">
                      <td className=" relative min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b">
                        <TextField
                          placeholder="Tanggal"
                          value={dataConfig.tgl}
                          name="tgl"
                          onChange={(e) => handleChangeConfig(e)}
                          fullWidth
                          InputProps={{
                            disableUnderline: false,
                          }}
                          inputProps={{
                            style: {
                              textAlign: "center",
                              fontSize: 15,
                            },
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute inset-y-1 right-1 opacity-30"
                        />
                      </td>
                      <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                        Saldo Awal
                      </td>
                      <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b"></td>
                      <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b"></td>
                      <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b"></td>
                      <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                        {akun.type_saldo === "debet" && (
                          <div className="relative">
                            <TextField
                              placeholder="saldo"
                              value={akun.saldo_awal}
                              name="saldo_awal"
                              onChange={(e) => {
                                handleSaldoAwal(e, akun.id_akun, idx);
                              }}
                              fullWidth
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                            />
                          </div>
                        )}
                      </td>
                      <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                        {akun.type_saldo === "kredit" && (
                          <div className="relative">
                            <TextField
                              placeholder="saldo"
                              value={akun.saldo_awal}
                              name="saldo_awal"
                              onChange={(e) =>
                                handleSaldoAwal(e, akun.id_akun, idx)
                              }
                              fullWidth
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                    {dataPosting &&
                      dataPosting
                        .filter((posting) => posting.id_akun === akun.id_akun)
                        .map((posting, index, row) => (
                          <tr
                            key={index}
                            className="bg-white border-t border-slate-300 "
                          >
                            <td className="min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b">
                              <div className="relative">
                                <div className="absolute z-50 top-0 -left-1 flex items-center">
                                  <PopMenuGS11
                                    indx={index}
                                    length={dataPosting.length}
                                    removeRow={() =>
                                      removeDataPosting(posting.id)
                                    }
                                  />
                                </div>
                                <TextField
                                  placeholder="Tanggal"
                                  value={posting.tgl}
                                  name="tgl"
                                  onChange={(e) =>
                                    handleChangePosting(e, posting.id)
                                  }
                                  fullWidth
                                  inputProps={{
                                    style: {
                                      textAlign: "center",
                                      fontSize: 15,
                                    },
                                  }}
                                />
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                                />
                              </div>
                            </td>
                            <td className="relative min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b">
                              <TextField
                                placeholder="Keterangan"
                                value={posting.keterangan}
                                name="keterangan"
                                onChange={(e) =>
                                  handleChangePosting(e, posting.id)
                                }
                                fullWidth
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                    fontSize: 15,
                                  },
                                }}
                              />
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-1 right-1 opacity-30"
                              />
                            </td>
                            <td className="relative min-w-20v max-w-20v px-1 py-2  text-gray-800 text-center border border-b">
                              <TextField
                                placeholder="Ref"
                                value={posting.ref}
                                name="ref"
                                onChange={(e) =>
                                  handleChangePosting(e, posting.id)
                                }
                                fullWidth
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                    fontSize: 15,
                                  },
                                }}
                              />
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-1 right-1 opacity-30"
                              />
                            </td>
                            <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                              {posting.posisi === "debet" && (
                                <div className="relative">
                                  <TextField
                                    placeholder="Debet"
                                    value={posting.debet}
                                    name="debet"
                                    onChange={(e) =>
                                      handlePosting(
                                        e,
                                        posting.id,
                                        akun.id_akun,
                                        idx
                                      )
                                    }
                                    fullWidth
                                    InputProps={{
                                      inputComponent: NumberFormatCustom,
                                    }}
                                    inputProps={{
                                      prefix: "Rp ",
                                      style: {
                                        textAlign: "center",
                                        fontSize: 15,
                                      },
                                    }}
                                  />
                                  <EditIcon
                                    fontSize="inherit"
                                    className="text-blue-700 absolute -inset-y-1 right-0 opacity-30"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                              {posting.posisi === "kredit" && (
                                <div className={`relative`}>
                                  <TextField
                                    placeholder="Kredit"
                                    value={posting.kredit}
                                    name="kredit"
                                    onChange={(e) =>
                                      handlePosting(
                                        e,
                                        posting.id,
                                        akun.id_akun,
                                        idx
                                      )
                                    }
                                    fullWidth
                                    InputProps={{
                                      inputComponent: NumberFormatCustom,
                                    }}
                                    inputProps={{
                                      prefix: "Rp ",
                                      style: {
                                        textAlign: "center",
                                        fontSize: 15,
                                      },
                                    }}
                                  />
                                  <EditIcon
                                    fontSize="inherit"
                                    className="text-blue-700 absolute -inset-y-1 right-0 opacity-30"
                                  />
                                </div>
                              )}
                            </td>
                            <td
                              className={`${
                                row.length - 1 === index &&
                                akun.type_saldo === "debet" &&
                                "bg-true-emerald-500"
                              } min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b`}
                            >
                              {akun.type_saldo === "debet" &&
                                numberFormat(posting.saldototal)}
                            </td>
                            <td
                              className={`${
                                row.length - 1 === index &&
                                akun.type_saldo === "kredit" &&
                                "bg-true-emerald-500"
                              } min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b`}
                            >
                              {akun.type_saldo === "kredit" &&
                                numberFormat(posting.saldototal)}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-row justify-end space-x-1 mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={classes.btnaddadata}
                  onClick={() => addPosting("debet", akun.id_akun)}
                >
                  Tambah Posting Debet
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={classes.btnaddadata}
                  onClick={() => addPosting("kredit", akun.id_akun)}
                >
                  Tambah Posting Kredit
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotaAkunList;
