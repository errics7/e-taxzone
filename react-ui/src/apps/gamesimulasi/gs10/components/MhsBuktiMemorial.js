import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import { ShimmerTable, ShimmerSectionHeader } from "react-shimmer-effects"; 
import { Droppable } from "react-beautiful-dnd";
import EditIcon from "@mui/icons-material/Edit"; 
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField"; 
import InlinePopInput from "./InlinePopInput";
import ItemsDataTotalPenyusutanGs10 from "./ItemsDataTotalPenyusutanGs10";
import ItemsDataNilaiAlokasiGs10 from "./ItemsDataNilaiAlokasiGs10";
import Tooltip from "@mui/material/Tooltip";
import { forwardRef } from "react";

const useStyles = makeStyles((theme) => ({
  btnsave: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnreset: {
    backgroundColor: "#FF8E90",
    textTransform: "none",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#FF4C4D",
      boxShadow: "none",
    },
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
            value: values.value,
          },
        });
      }}
      style={{
        textAlign: "right",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

export default function MhsBuktiMemorial(props) {
  const classes = useStyles();
  const dataori = props.data;
  const jawab = props.jawab
    ? props.jawab
    : { tbl1: [], penyusutanharga: { value: 0, error: false } };

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <>
      <div className="opacity-50 italic font-semibold">Worksheet:</div>
      {dataori ? (
        <div className="p-3 border border-dashed">
          <div className="flex">
            <div className="font-semibold mr-3">
              {dataori && dataori.config.namept}
            </div>
            <div>( ) Harian ( ) Penyesuaian</div>
          </div>
          <br />
          <h1 className="mt-5 mx-auto text-center text-2xl font-semibold">
            BUKTI MEMORIAL
          </h1>
          <h2 className="mx-auto text-sm w-full text-center">
            NO. BM:{dataori && dataori.config.nobm}
          </h2>
          <div className="mt-3 mb-2">
            <div className="inline ">
              {dataori && dataori.config.narasialokasi}
            </div>{" "}
            <div className="inline">
              {props.valid.check && props.valid.pass ? (
                <Droppable droppableId={"src_nilai_0_penyusutan"}>
                  {(provided, snapshot) => (
                    <span
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="inline-block relative"
                    >
                      {jawab.penyusutanharga.value_dnd ? (
                        <ItemsDataTotalPenyusutanGs10
                          data={jawab.penyusutanharga.value_dnd}
                          index={0}
                          addon="penyusutan"
                          checker={false}
                        />
                      ) : (
                        <>
                          {" "}
                          <span className="border opacity-50">
                            {toRp(jawab.penyusutanharga.value)}
                          </span>{" "}
                        </>
                      )}

                      {provided.placeholder}
                    </span>
                  )}
                </Droppable>
              ) : (
                <InlinePopInput
                  value={jawab.penyusutanharga.value}
                  seterror={props.valid.check && jawab.penyusutanharga.error}
                  onChange={(event) => {
                    props.setjawab({
                      ...jawab,
                      penyusutanharga: {
                        ...jawab.penyusutanharga,
                        value: event.target.value,
                      },
                    });
                  }}
                />
              )}
            </div>{" "}
            <div className="inline">dialokasikan ke:</div>
          </div>
          <table className="border-collapse w-full">
            <tbody>
              {jawab.tbl1.map((item, index) => (
                <tr key={index}>
                  <td className="w-3/5 p-2 px-3 text-left border border-slate-300 table-cell">
                    {item.nama}
                  </td>
                  <td className="w-2/5 p-2 text-right border border-slate-300 table-cell">
                    {props.valid.check && props.valid.pass ? (
                      <Droppable droppableId={`src_nilai_${index}`}>
                        {(provided, snapshot) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="inline-block relative"
                          >
                            {item.value_dnd ? (
                              <ItemsDataNilaiAlokasiGs10
                                index={index}
                                data={item.value}
                                checker={false}
                              />
                            ) : (
                              <>
                                {" "}
                                <span className="border opacity-50">
                                  {toRp(item.value)}
                                </span>{" "}
                              </>
                            )}

                            {provided.placeholder}
                          </span>
                        )}
                      </Droppable>
                    ) : (
                      <div
                        className={`relative px-1 border-b hover:border-blue-200 ${
                          props.valid.check &&
                          item.error &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        {props.valid.check && item.error ? (
                          <Tooltip
                            title="Ada yang salah, pastikan anda mengisi dengan benar"
                            placement="right-end"
                          >
                            <TextField
                              value={item.value}
                              name="nilai"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <TextField
                            value={item.value}
                            name="nilai"
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                              inputComponent: NumberFormatCustom,
                            }}
                            onChange={(event) => {
                              props.setjawab({
                                ...jawab,
                                tbl1: jawab.tbl1.map((el, i) =>
                                  index === i
                                    ? {
                                        ...el,
                                        value: Number(event.target.value),
                                      }
                                    : el
                                ),
                              });
                            }}
                          />
                        )}

                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute inset-y-0 -right-1 opacity-40"
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-row-reverse mt-3">
            <div
              className={`flex flex-row-reverse py-1 w-full 2xl:w-1/2 ${
                !props.valid.pass && " bg-gradient-to-l from-slate-100"
              }`}
            >
              <Button
                variant="contained"
                color="primary"
                className={classes.btnsave}
                disabled={props.valid.check}
                onClick={() => {
                  props.check();
                }}
              >
                Check
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.btnreset}
                onClick={() => props.reset()}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-5">
          <div className="-mb-10">
            <ShimmerSectionHeader center />
          </div>
          <ShimmerTable row={2} col={5} />
        </div>
      )}
    </>
  );
}
