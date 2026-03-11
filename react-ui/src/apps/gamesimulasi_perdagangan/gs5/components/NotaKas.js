import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import { filter, findIndex, map, sum, sumBy } from "lodash";
import { forwardRef } from "react";

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
        textAlign: "center",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

export default function NotaKas(props) {
  const { itmnota, i } = props;
  const { databarang, datanota, dataakun } = props.dataConfig;

  //Invoice handle input
  const handleInpInvoice = (e, index) => {
    const { name, value } = e.target;
    const lstnota = [...datanota];
    lstnota[index][name] = value;

    props.setdataConfig({
      ...props.dataConfig,
      datanota: lstnota,
    });
  };
  const handleInpNominal = (e, item) => {
    const { name, value } = e.target;
    const listbrg = [...databarang];
    // UPDATE HPP ==linked==> nota/inv->dataakun //
    //UPDATE LINK AUTO barang DI INVOICE /datanota
    const inota = findIndex(datanota, { uid: item.uid });
    const listnota = [...datanota];
    listnota[inota][name] = Number(value);
    //
    const bardiinv = filter(databarang, {
      uid_invoice: item.uid,
    });

    const datasama = sum(
      map(bardiinv, (x) => {
        const hpp = Number(x.jumlah) * Number(x.hpp);
        return hpp ? hpp : 0;
      })
    );
    listnota[inota]["hpp"] = datasama;
    listnota[inota]["persediaan"] = datasama;
    //UPDATE LINK AUTO DI Dataakun
    var listakun = [...dataakun];
    listakun = updtDaakun(
      listakun,
      "kas",
      sumBy(listnota, "jumlah") + sumBy(listnota, "nilaia")
    );
    listakun = updtDaakun(listakun, "hpp", sumBy(listnota, "hpp"));
    listakun = updtDaakun(listakun, "penjualan", sumBy(listnota, "subtotal"));
    listakun = updtDaakun(listakun, "ppnkeluar", sumBy(listnota, "ppn"));
    listakun = updtDaakun(listakun, "piutangdagang", sumBy(listnota, "nilaia"));
    listakun = updtDaakun(
      listakun,
      "persediaan",
      sumBy(listnota, "persediaan")
    );

    props.setdataConfig({
      ...props.dataConfig,
      databarang: listbrg,
      datanota: listnota,
      dataakun: listakun,
    });
  };

  const updtDaakun = (inarr, name, val) => {
    var arr = inarr;
    const i = findIndex(arr, { name: name });
    // Replace item at index using native splice
    arr.splice(i, 1, { ...arr[i], jumlah: val });
    return arr;
  };

  return (
    <div className="w-full border-2 border-dashed">
      <div className="grid grid-cols-6 gap-4 border-b pb-8">
        <div className="col-start-1 col-end-4  text-base">
          <div className="flex flex-col ml-3 mt-3 space-y-2">
            <InputGrowUpTextWithName
              name="CV Name"
              type="text"
              placeholder="Nama CV"
              value={props.dataConfig ? props.dataConfig.cvname : ""}
              index={0}
              style={`font-semibold text-2xl uppercase`}
              onChange={(e) => {
                props.setdataConfig({
                  ...props.dataConfig,
                  cvname: e.target.value,
                });
              }}
            />
            <InputGrowUpTextWithName
              name="cvalamat"
              type="text"
              value={props.dataConfig ? props.dataConfig.cvalamat : ""}
              index={0}
              style={`text-base font-medium`}
              onChange={(e) => {
                props.setdataConfig({
                  ...props.dataConfig,
                  cvalamat: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="col-end-10">
          <div className="flex flex-col mt-3 space-y-2 pr-3">
            <h1 className="text-2xl font-semibold">BUKTI KAS MASUK</h1>
            <div>
              <label>
                No &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
              </label>
              <InputGrowUpTextWithName
                icon={true}
                name="no"
                type="text"
                placeholder="No"
                value={itmnota.no}
                index={i}
                style={`text-base`}
                onChange={(e) => handleInpInvoice(e, i)}
              />
            </div>
            <div>
              <label>Tanggal : </label>
              <InputGrowUpTextWithName
                icon={true}
                name="tgl"
                type="text"
                placeholder="Tanggal"
                value={itmnota.tgl}
                index={i}
                style={`text-base`}
                onChange={(e) => handleInpInvoice(e, i)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* PENERIMA KAS */}
      <div className="flex flex-col px-3 py-5 mt-5 max-w-4xl mx-auto space-y-2">
        <div className="flex text-lg">
          <div className="flex justify-between w-44">
            <p>Sudah Terima dari</p>
            <p>:</p>
          </div>
          <InputGrowUpTextWithName
            icon={true}
            name="penerima"
            type="text"
            placeholder="Penerima"
            value={itmnota.penerima}
            index={i}
            style={`text-base ml-3`}
            onChange={(e) => handleInpInvoice(e, i)}
          />
        </div>
        <div className="flex text-lg">
          <div className="flex justify-between w-44">
            <p>Untuk Pembayaran</p>
            <p>:</p>
          </div>
          <InputGrowUpTextWithName
            icon={true}
            name="keperluan"
            type="text"
            placeholder="Keperluan"
            value={itmnota.keperluan}
            index={i}
            style={`text-base ml-3`}
            onChange={(e) => handleInpInvoice(e, i)}
          />
        </div>
        <div className="flex text-lg">
          <div className="flex justify-between w-44">
            <p>Sebesar</p>
            <p>:</p>
          </div>
          <InputGrowUpTextWithName
            icon={true}
            name="nilaih"
            type="text"
            placeholder="Nilai dalam Huruf"
            value={itmnota.nilaih}
            index={i}
            style={`text-base ml-3`}
            onChange={(e) => handleInpInvoice(e, i)}
          />
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4 mt-10 mb-24">
        <div className="col-end-10">
          <div className="flex flex-col mt-3 space-y-2">
            <InputGrowUpTextWithName
              icon={true}
              name="tgl2"
              type="text"
              placeholder="Tanggal"
              value={itmnota.tgl2}
              index={i}
              style={`text-base -ml-3`}
              onChange={(e) => handleInpInvoice(e, i)}
            />
          </div>
        </div>
        <div className="col-start-1 col-end-12 mx-auto p-1 border border-dashed">
          <div className="px-6 py-1 relative bg-slate-100 text-xl font-semibold tracking-widest">
            <TextField
              placeholder="Nilai Angka"
              value={itmnota.nilaia}
              name="nilaia"
              onChange={(e) => handleInpNominal(e, itmnota)}
              fullWidth
              InputProps={{
                disableUnderline: true,
                inputComponent: NumberFormatCustom,
              }}
              inputProps={{
                prefix: "Rp ",
                style: {
                  textAlign: "center",
                  fontSize: 18,
                },
              }}
            />
            <EditIcon
              fontSize="inherit"
              className="text-blue-700 absolute p-0.5 inset-y-0 right-1 opacity-30"
            />
          </div>
        </div>
        <div className="col-end-10">
          <div className="mx-auto block text-center mt-3">
            Kasir {props.dataConfig ? props.dataConfig.cvname : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
