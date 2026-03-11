/* eslint-disable eqeqeq */
import React, {forwardRef} from "react";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
// import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import { findIndex, find } from "lodash";


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

const TableWsMhsAdmin = ({
    dataConfig,
    setdataConfig
}) => {

    const handleInputChange = (e, uid) => {
        const { name, value } = e.target;
        const index = findIndex(dataConfig.dataakun, { uid: uid });
        const list = [...dataConfig.dataakun];
        list[index][name] = value;
        setdataConfig({ ...dataConfig, dataakun: list });
      };

    return (
    <>
        <div className="mt-5">Data Worksheet Preview :</div>
        {dataConfig && dataConfig.dataakun.map((item, index) =>{
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
                            {/* {item.tgl} */}
                            <div
                                    className="relative"
                                >
                                    <TextField
                                        fullWidth
                                        // className={classes.inpputTanggal}
                                        placeholder="Tanggal"
                                        value={item.tgl}
                                        name="tgl"
                                        onChange={(e) => handleInputChange(e, item.uid)}
                                        inputProps={{
                                          style: {
                                            fontSize: 14,
                                            textAlign: "center",
                                          },
                                        }}
                                      />
                                    
                                        <EditIcon
                                            fontSize="inherit"
                                            className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                        />
                                      
                                </div>  
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
                        {item.name === "kas" ?
                            item.posisi === "kredit" && 
                              <div
                                className="relative"
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    // className={classes.inpputKeperluan}
                                    placeholder="Debet"
                                    value={item.jumlah}
                                    name="jumlah"
                                    onChange={(e) => handleInputChange(e, item.uid)}
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
                                    className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                />
                                    
                            </div> :
                            item.posisi === "debet" && 
                              <div
                                className="relative"
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    // className={classes.inpputKeperluan}
                                    placeholder="Debet"
                                    value={item.jumlah}
                                    name="jumlah"
                                    onChange={(e) => handleInputChange(e, item.uid)}
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
                                    className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                />
                                    
                            </div>
                        }
                            {/* {item.posisi === "debet" && numberFormat(item.jumlah)} */}
                        </td>
                        <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                        {item.name === "kas" ?
                            item.posisi === "debet" && 
                              <div
                                className="relative"
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    // className={classes.inpputKeperluan}
                                    placeholder="Debet"
                                    value={item.jumlah}
                                    name="jumlah"
                                    onChange={(e) => handleInputChange(e, item.uid)}
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
                                    className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                />
                                    
                            </div> :
                            item.posisi === "kredit" && 
                              <div
                                className="relative"
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    // className={classes.inpputKeperluan}
                                    placeholder="Debet"
                                    value={item.jumlah}
                                    name="jumlah"
                                    onChange={(e) => handleInputChange(e, item.uid)}
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
                                    className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                />
                                    
                            </div>
                        }
                       
                        </td>
                    </tr>
                    {
                        item.idakun.map((id, i) => {
                            const cari = find(dataConfig.datajurnal, { uid: id })
                            const countD = item.name === "kas" ? parseInt(cari.kas) :
                            item.name === "persediaan" ? parseInt(cari.persediaan) :
                            item.name === "ppnmasukan" ? parseInt(cari.ppnmasukan) :
                            item.name === "hutangdagang" && parseInt(cari.hutangdagang)

                            const countNum = cari && 
                            item.name === "kas" ? numberFormat(cari.kas) :
                            item.name === "persediaan" ? numberFormat(cari.persediaan) :
                            item.name === "ppnmasukan" ? numberFormat(cari.ppnmasukan) :
                            item.name === "hutangdagang" && numberFormat(cari.hutangdagang)   

                            if(item.name === "kas") {
                                TotCount.push(parseInt(TotCount[i]) - countD)
                            } else {
                                TotCount.push(parseInt(TotCount[i]) + countD)
                            }
                           
                            return (
                                <tr key={cari.uid} className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                                    
                                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b p-28">
                                    <div
                                        className="bg-amber-200 py-1.5 px-0.5"
                                    >
                                        {cari && cari.tgl}
                                    </div>
                                    </td>
                                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                                        POSTING
                                    </td>
                                    <td className="lg:w-auto px-1 py-2 capitalize  text-slate-800 text-center border border-b">
                                    <div
                                        className="bg-amber-200 py-1.5 px-0.5"
                                    >
                                        {cari && cari.type}
                                    </div>
                                    </td>
                                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                                    
                                    {
                                        item.posisi === "debet" ? (
                                            <div
                                                className="bg-amber-200 py-1.5 px-0.5"
                                            >
                                                {countNum}
                                            </div>
                                        ) : <div></div>
                                    }
                                    
                                    </td>
                                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                                    {
                                        item.posisi === "kredit" ?
                                        <div
                                            className="bg-amber-200 py-1.5 px-0.5"
                                        >
                                            {countNum}
                                        </div>:
                                        <div></div>
                                    }
                                    </td>
                                    <td className="lg:w-auto px-1 py-2 text-center  text-slate-800 border border-b">
                                        {/* {item.posisi === "debet" && numberFormat(TotCount[i+1])} */}
                                        {item.name === "kas" ?
                                            item.posisi === "kredit" && numberFormat(TotCount[i+1]) :
                                            item.posisi === "debet" && numberFormat(TotCount[i+1])
                                        }
                                    </td>                
                                    <td className="lg:w-auto px-1 py-2 text-center  text-slate-800 border border-b">
                                         {/* {item.posisi === "kredit" && numberFormat(TotCount[i+1])} */}
                                        {item.name === "kas" ?
                                            item.posisi === "debet" && numberFormat(TotCount[i+1]) :
                                            item.posisi === "kredit" && numberFormat(TotCount[i+1])
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
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
    )
};

export default TableWsMhsAdmin;
