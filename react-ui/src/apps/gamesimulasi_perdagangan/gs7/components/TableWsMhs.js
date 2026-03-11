/* eslint-disable eqeqeq */
import React, {forwardRef} from "react";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
// import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import { findIndex } from "lodash";


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

const TableWsMhs = ({
    jawab1,
    setJawab,
    checking1
}) => {

    const handleInputChange = (e, sec, uid) => {
        const { name, value } = e.target;
        const index = findIndex(jawab1[sec].datajawaban, { uid: uid });
        const listjwb = [...jawab1];
        listjwb[sec].datajawaban[index][name] = value;
        setJawab(listjwb);
      };

    return (
        <>
        {jawab1 && jawab1.map((item, index) =>{
            let TotCount = [item.jumlah]
            return (
                <div key={index} className="mt-3 overflow-x-auto col-span-8">
                <table className="border-collapse min-w-full table-fixed">
                    <thead>
                    <tr>
                        <th
                        colSpan="12"
                        className="w-12/12 p-3 bg-slate-50 text-slate-600 border border-slate-300"
                        >
                        <div className="font-bold capitalize text-left">
                            Nama Akun: {item.detailname}
                        </div>
                        <div className="text-left">
                            No. Akun: 
                            {
                                item.name === "kas" ? " 110" :
                                item.name === "persediaan" ? " 115" :
                                item.name === "ppnmasukan" ? " 116" :
                                item.name === "hutangdagang" && " 210"
                            }
                        </div>
                        </th>
                    </tr>
                    <tr>
                        <th
                        rowSpan="2"
                        className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                        Tgl
                        </th>
                        <th
                        rowSpan="2"
                        className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                        Keterangan
                        </th>
                        <th
                        rowSpan="2"
                        className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                        Ref
                        </th>
                        <th
                        rowSpan="2"
                        className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                        Debet
                        </th>
                        <th
                        rowSpan="2"
                        className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                        Kredit
                        </th>
                        <th
                        colSpan="3"
                        className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                        Saldo
                        </th>
                    </tr>
                    <tr>
                        <th className="min-w-15v max-w-15v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                        Debet
                        </th>
                        <th className="min-w-15v max-w-15v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                        Kredit
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                            {item.tgl}
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        Saldo Awal
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                            {/* {item.name === "kas" ?
                                item.posisi === "debet" &&  numberFormat(item.jumlah) :
                                item.posisi === "kredit" &&  numberFormat(item.jumlah)
                            } */}
                                {item.name === "kas" ?
                                    item.posisi === "kredit" && numberFormat(item.jumlah) :
                                    item.posisi === "debet" && numberFormat(item.jumlah)
                                }
                            {/* {item.posisi === "debet" &&
                            } */}
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                            {/* {item.posisi === "kredit" && numberFormat(item.jumlah)} */}
                            {item.name === "kas" ?
                                item.posisi === "debet" && numberFormat(item.jumlah) :
                                item.posisi === "kredit" && numberFormat(item.jumlah)
                            }
                            {/* {item.name === "kas" ?
                                item.posisi === "debet" &&  numberFormat(item.jumlah) :
                                item.posisi === "kredit" &&  numberFormat(item.jumlah)
                            } */}
                        </td>
                    </tr>
                    {item.datajawaban.map((data, i) => {
                        if(item.name === "kas") {
                            TotCount.push(parseInt(TotCount[i]) - parseInt(data.jwb_jumlah))
                        } else {
                            TotCount.push(parseInt(TotCount[i]) + parseInt(data.jwb_jumlah))
                        }
                        
                        return (
                            <tr key={data.uid} className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b p-28">
                                <div
                                    className={`relative ${
                                    checking1 &&
                                    data.err_tgl &&
                                    "bg-red-300 animate-pulse"
                                    }`}
                                >
                                    <TextField
                                        fullWidth
                                        // className={classes.inpputTanggal}
                                        placeholder="Jawab Tanggal"
                                        value={data.jwb_tgl}
                                        name="jwb_tgl"
                                        onChange={(e) =>
                                          handleInputChange(e, index, data.uid)
                                        }
                                        InputProps={{
                                          readOnly: checking1,
                                        }}
                                        inputProps={{
                                          style: {
                                            fontSize: 14,
                                            textAlign: "center",
                                          },
                                        }}
                                      />
                                    {!checking1 && (
                                        <EditIcon
                                            fontSize="inherit"
                                            className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                        />
                                    )}  
                                </div>                  
                                </td>
                                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                                    POSTING
                                </td>
                                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                                <div
                                    className={`relative ${
                                    checking1 &&
                                    data.err_ref &&
                                    "bg-red-300 animate-pulse"
                                    }`}
                                >
                                <TextField
                                    fullWidth
                                    // className={classes.inpputTanggal}
                                    placeholder="Jawab Ref"
                                    value={data.jwb_ref}
                                    name="jwb_ref"
                                    onChange={(e) =>
                                        handleInputChange(e, index, data.uid)
                                    }
                                    InputProps={{
                                        readOnly: checking1,
                                    }}
                                    inputProps={{
                                        style: {
                                        fontSize: 14,
                                        textAlign: "left",
                                        paddingLeft: 5,
                                        },
                                    }}
                                />
                                {!checking1 && (
                                    <EditIcon
                                        fontSize="inherit"
                                        className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                    />
                                )}
                                </div>
                                </td>
                                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                                
                                {
                                    item.posisi === "debet" ? (
                                        <div
                                            className={`relative ${
                                            checking1 &&
                                            data.err_jumlah &&
                                            "bg-red-300 animate-pulse"
                                            }`}
                                        >
                                        <TextField
                                            fullWidth
                                            multiline
                                            // className={classes.inpputKeperluan}
                                            placeholder="debet"
                                            value={data.jwb_jumlah}
                                            name="jwb_jumlah"
                                            onChange={(e) =>
                                                handleInputChange(e, index, data.uid)
                                            }
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
                                    {!checking1 && (
                                        <EditIcon
                                            fontSize="inherit"
                                            className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                        />
                                    )}    
                                    </div>
                                    ) : <div></div>
                                }
                                
                                </td>
                                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                                {
                                    item.posisi === "kredit" ?
                                    <div
                                        className={`relative ${
                                        checking1 &&
                                        data.err_jumlah &&
                                        "bg-red-300 animate-pulse"
                                        }`}
                                    >
                                    <TextField
                                        fullWidth
                                        multiline
                                        // className={classes.inpputKeperluan}
                                        placeholder="kredit"
                                        value={data.jwb_jumlah}
                                        name="jwb_jumlah"
                                        onChange={(e) =>
                                            handleInputChange(e, index, data.uid)
                                        }
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
                                    {!checking1 && (
                                    <EditIcon
                                        fontSize="inherit"
                                        className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                    />
                                    )}</div> :
                                    <div></div>
                                }
                                </td>
                                <td className="lg:w-auto px-1 py-2 text-slate-800 text-center border border-b">
                                    {item.name === "kas" ?
                                    item.posisi === "kredit" && numberFormat(TotCount[i+1]) :
                                    item.posisi === "debet" && numberFormat(TotCount[i+1])
                                    }
                                </td>                
                                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                                {item.name === "kas" ?
                                    item.posisi === "debet" && numberFormat(TotCount[i+1]) :
                                    item.posisi === "kredit" && numberFormat(TotCount[i+1])
                                }
                                </td>
                            </tr>
                        )
                    })}
                   
                    <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        &nbsp;
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        &nbsp;
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        &nbsp;
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        &nbsp;
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        &nbsp;
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        &nbsp;
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        &nbsp;
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            )
        })}
        </>
    );
};

export default TableWsMhs;
