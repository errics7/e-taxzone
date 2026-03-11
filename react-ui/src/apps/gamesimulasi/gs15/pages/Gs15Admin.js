//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { isEqual } from "lodash";
import makeStyles from "@mui/styles/makeStyles";
import { CircularProgress, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import TabelManagerAdmin from "../components/TabelManagerAdmin";
import TabelKunciJawaban from "../components/TabelKunciJawaban";
import AdminBuktiMemorialGs15 from "../components/AdminBuktiMemorialGs15";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import { Save } from "@mui/icons-material";
import swal from "sweetalert";

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
//#endregion

export default function Gs15Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [ori, setOri] = useState(null);
  const [dataConfig, setDataConfig] = useState({
    narasisoal: "",
    namept: "PT. MITRA ANTAR POLINDO MALANG",
    nobm: "05 /BM/12/2021",
    narasibuktimemo:
      "Alokasi Biaya overhead sesungguhnya sie pulp tahun 2021 ke Barang Dalam proses BOP - Seksi Pulp sebesar ",
  });
  //#region baseData
  const [headers, setHeaders] = useState([
    {
      uuid: "b5a9bfa7-21a7-4732-85d1-401e9c0414b4",
      alias: "Biaya Produksi",
      colspan: 7,
      rowspan: 1,
    },
    {
      uuid: "a0606052-c391-4128-8ab1-694945cc0c95",
      alias: "Beban & Admin Umum",
      colspan: 1,
      rowspan: 3,
    },
    {
      uuid: "8a101f1e-a02b-4b95-bfd2-220d538735a0",
      alias: "Beban Pemasaran",
      colspan: 1,
      rowspan: 3,
    },
  ]);
  const [departements, setDepartements] = useState([
    {
      uuid: "532e59d2-1408-426b-bf91-3f712b6811fe",
      alias: "Departemen Pembantu",
      colspan: 2,
      rowspan: 1,
    },
    {
      uuid: "9f7976d6-3ccc-465f-81a1-16e6b3fd7f76",
      alias: "Departemen Produksi",
      colspan: 5,
      rowspan: 1,
    },
  ]);
  const [sections, setSections] = useState([
    {
      uuid: "450d9beb-b11a-456a-b0cc-ce5daa828ceb",
      alias: "Sie Listrik",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "5682f6d8-6451-4820-90e7-5d8b15bd4abc",
      alias: "Sie U. Pabrik",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "6c62e011-8904-4a92-bb1d-349f6d9f9add",
      alias: "Sie Pulp",
      colspan: 5,
      rowspan: 1,
    },
  ]);
  const [kode, setKode] = useState([
    {
      uuid: "fbd120c0-f88c-4621-b05e-1a5b89173889",
      alias: "510",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "0732e5a1-5a20-493b-b309-fb4fe24b4115",
      alias: "511",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "d34eb39f-fed0-46ec-892d-03b597eaab6f",
      alias: "520",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "90fe68d9-3423-4c24-b0b8-e2b8c1783325",
      alias: "530",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "7eba21ba-023c-4e8a-a7fa-82595758f3ea",
      alias: "531",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "7875af3a-d94f-4ce4-a920-c360a3e20975",
      alias: "532",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "0f9d67ac-8050-4ef2-ba18-b561c78fc48c",
      alias: "533",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "761a4394-4f1e-4f3e-9566-3cf1f7643b91",
      alias: "600",
      colspan: 1,
      rowspan: 1,
    },
    {
      uuid: "44853413-b554-43f0-bc4c-06d796f41928",
      alias: "700",
      colspan: 1,
      rowspan: 1,
    },
  ]);
  const [kpembantu, setKpembantu] = useState([
    {
      uuid: "751bef25-5087-435e-8cec-3264f9282adf",
      alias: "1",
      type: 1,
      status: false,
    },
    {
      uuid: "a9fc5025-f511-4864-8a99-9359d59638fa",
      alias: "11",
      type: 1,
      status: false,
    },
    {
      uuid: "4560b164-1115-4538-a356-81baf57acdd1",
      alias: "12",
      type: 1,
      status: false,
    },
    {
      uuid: "7d53c97e-c108-4719-83c5-aab8ea5190d0",
      alias: "13",
      type: 1,
      status: false,
    },
    {
      uuid: "3bed54c6-8573-4421-ae29-5eb2e14297dc",
      alias: "14",
      type: 1,
      status: false,
    },
    {
      uuid: "654867e6-746e-4ea3-b564-987c20dd1935",
      alias: "15",
      type: 1,
      status: false,
    },
    {
      uuid: "19320e62-573d-4884-9c43-d8467b3ffe50",
      alias: "2",
      type: 1,
      status: false,
    },
    {
      uuid: "3458abe9-9e1a-4733-8c66-7011781343ae",
      alias: "21",
      type: 1,
      status: false,
    },
    {
      uuid: "fe4ffd9b-c820-47b7-ae5e-051abedda5bf",
      alias: "22",
      type: 1,
      status: false,
    },
    {
      uuid: "9461eea6-eeb9-4649-a745-7cf631949721",
      alias: "7",
      type: 2,
      status: false,
    },
    {
      uuid: "0231857b-cc25-4995-ab49-ff090c09b29c",
      alias: "71",
      type: 2,
      status: false,
    },
    {
      uuid: "64796a4f-8148-4ea9-b7fc-aa5d71b7d50f",
      alias: "72",
      type: 2,
      status: false,
    },
    {
      uuid: "53db4d74-48a9-4c52-b061-2e79bc85a00f",
      alias: "",
      type: 3,
      status: true,
    },
  ]);
  const [data, setData] = useState([
    {
      uuid: "3fbfabad-bbec-44df-b917-c6c85558f098",
      idc: "90fe68d9-3423-4c24-b0b8-e2b8c1783325",
      idr: "a9fc5025-f511-4864-8a99-9359d59638fa",
      value: 3000,
      type: 1,
    },
    {
      uuid: "b1d5800c-bede-4cbb-b077-03fa8ad641eb",
      idc: "90fe68d9-3423-4c24-b0b8-e2b8c1783325",
      idr: "3bed54c6-8573-4421-ae29-5eb2e14297dc",
      value: 1000,
      type: 1,
    },
    {
      uuid: "5db420bb-5196-4081-b31c-6bad020f785e",
      idc: "0732e5a1-5a20-493b-b309-fb4fe24b4115",
      idr: "654867e6-746e-4ea3-b564-987c20dd1935",
      value: 2500,
      type: 1,
    },
    {
      uuid: "f774404c-b3c8-40df-9930-6686e043afbb",
      idc: "7875af3a-d94f-4ce4-a920-c360a3e20975",
      idr: "4560b164-1115-4538-a356-81baf57acdd1",
      value: 5000,
      type: 1,
    },
    {
      uuid: "1869c021-04ba-4ed8-be32-c75adf1c6606",
      idc: "7875af3a-d94f-4ce4-a920-c360a3e20975",
      idr: "3bed54c6-8573-4421-ae29-5eb2e14297dc",
      value: 2000,
      type: 1,
    },
    {
      uuid: "efa6fcab-8284-4516-b74d-02e165882f51",
      idc: "fbd120c0-f88c-4621-b05e-1a5b89173889",
      idr: "3458abe9-9e1a-4733-8c66-7011781343ae",
      value: 4000,
      type: 1,
    },
    {
      uuid: "d1e53ecb-2dc6-4595-b4b0-919c40abbcd8",
      idc: "fbd120c0-f88c-4621-b05e-1a5b89173889",
      idr: "fe4ffd9b-c820-47b7-ae5e-051abedda5bf",
      value: 2000,
      type: 1,
    },
    {
      uuid: "6cbdf779-c9a9-4ffa-8dbc-a9b2419d58ae",
      idc: "0732e5a1-5a20-493b-b309-fb4fe24b4115",
      idr: "fe4ffd9b-c820-47b7-ae5e-051abedda5bf",
      value: 5000,
      type: 1,
    },
    {
      uuid: "6cc799cd-9b15-4816-b12a-19e1267886a9",
      idc: "0732e5a1-5a20-493b-b309-fb4fe24b4115",
      idr: "3458abe9-9e1a-4733-8c66-7011781343ae",
      value: 6500,
      type: 1,
    },
    {
      uuid: "e1881cc6-06c5-4099-9ff3-97d28aabecf7",
      idc: "d34eb39f-fed0-46ec-892d-03b597eaab6f",
      idr: "3458abe9-9e1a-4733-8c66-7011781343ae",
      value: 3000,
      type: 1,
    },
    {
      uuid: "f9cdfcf4-20ef-4f9c-b0aa-326fe042b0d4",
      idc: "90fe68d9-3423-4c24-b0b8-e2b8c1783325",
      idr: "3458abe9-9e1a-4733-8c66-7011781343ae",
      value: 6000,
      type: 1,
    },
    {
      uuid: "ddceb48a-86a4-4d0f-8457-5a52c95ae538",
      idc: "90fe68d9-3423-4c24-b0b8-e2b8c1783325",
      idr: "fe4ffd9b-c820-47b7-ae5e-051abedda5bf",
      value: 6000,
      type: 1,
    },
    {
      uuid: "ae03b8ee-5ec7-491e-97cc-8e4fd329f56f",
      idc: "7eba21ba-023c-4e8a-a7fa-82595758f3ea",
      idr: "3458abe9-9e1a-4733-8c66-7011781343ae",
      value: 1000,
      type: 1,
    },
    {
      uuid: "e84c0087-400a-4550-8adc-683fb9b2059b",
      idc: "7875af3a-d94f-4ce4-a920-c360a3e20975",
      idr: "3458abe9-9e1a-4733-8c66-7011781343ae",
      value: 7000,
      type: 1,
    },
    {
      uuid: "21417985-b728-4b7c-92f9-454e192d7cf2",
      idc: "7875af3a-d94f-4ce4-a920-c360a3e20975",
      idr: "fe4ffd9b-c820-47b7-ae5e-051abedda5bf",
      value: 1000,
      type: 1,
    },
    {
      uuid: "fa96ff95-f31e-4e91-93ee-146bea28cda7",
      idc: "0f9d67ac-8050-4ef2-ba18-b561c78fc48c",
      idr: "3458abe9-9e1a-4733-8c66-7011781343ae",
      value: 1000,
      type: 1,
    },
    {
      uuid: "6f056375-0a17-4ad5-8280-97d767221b21",
      idc: "761a4394-4f1e-4f3e-9566-3cf1f7643b91",
      idr: "3458abe9-9e1a-4733-8c66-7011781343ae",
      value: 5000,
      type: 1,
    },
    {
      uuid: "8f58743d-11a2-4a56-93de-0dbfab2c2b7c",
      idc: "761a4394-4f1e-4f3e-9566-3cf1f7643b91",
      idr: "fe4ffd9b-c820-47b7-ae5e-051abedda5bf",
      value: 1000,
      type: 1,
    },
    {
      uuid: "011216d1-2fd0-4684-944c-eb9d88f3c353",
      idc: "44853413-b554-43f0-bc4c-06d796f41928",
      idr: "3458abe9-9e1a-4733-8c66-7011781343ae",
      value: 2000,
      type: 1,
    },
    {
      uuid: "9fba1aa5-ddec-4a75-a5c8-c026bce70b18",
      idc: "44853413-b554-43f0-bc4c-06d796f41928",
      idr: "fe4ffd9b-c820-47b7-ae5e-051abedda5bf",
      value: 7000,
      type: 1,
    },
    {
      uuid: "9c104208-d61a-4055-b622-43f018277e8d",
      idc: "0732e5a1-5a20-493b-b309-fb4fe24b4115",
      idr: "64796a4f-8148-4ea9-b7fc-aa5d71b7d50f",
      value: -14000,
      type: 2,
    },
    {
      uuid: "ea29c3db-0857-440a-9265-fd7cc766cbd8",
      idc: "d34eb39f-fed0-46ec-892d-03b597eaab6f",
      idr: "64796a4f-8148-4ea9-b7fc-aa5d71b7d50f",
      value: 2000,
      type: 2,
    },
    {
      uuid: "0738b0f2-9639-43f9-9cbc-945f6a60a42c",
      idc: "7eba21ba-023c-4e8a-a7fa-82595758f3ea",
      idr: "64796a4f-8148-4ea9-b7fc-aa5d71b7d50f",
      value: 8000,
      type: 2,
    },
    {
      uuid: "a44fa32c-7d37-4789-8172-21527c054b3b",
      idc: "0f9d67ac-8050-4ef2-ba18-b561c78fc48c",
      idr: "64796a4f-8148-4ea9-b7fc-aa5d71b7d50f",
      value: 4000,
      type: 2,
    },
    {
      uuid: "d04472aa-0bde-44de-a479-6e9dee79a35b",
      idc: "fbd120c0-f88c-4621-b05e-1a5b89173889",
      idr: "0231857b-cc25-4995-ab49-ff090c09b29c",
      value: -6000,
      type: 2,
    },
    {
      uuid: "b34bbaec-2a05-45a8-b2c8-3f1c62cfc4e9",
      idc: "d34eb39f-fed0-46ec-892d-03b597eaab6f",
      idr: "0231857b-cc25-4995-ab49-ff090c09b29c",
      value: 1800,
      type: 2,
    },
    {
      uuid: "cfe3f51c-2528-473c-a2e7-93b0d1db0875",
      idc: "7eba21ba-023c-4e8a-a7fa-82595758f3ea",
      idr: "0231857b-cc25-4995-ab49-ff090c09b29c",
      value: 2400,
      type: 2,
    },
    {
      uuid: "92f0ca56-7c2d-46be-ae85-3970d2207d22",
      idc: "0f9d67ac-8050-4ef2-ba18-b561c78fc48c",
      idr: "0231857b-cc25-4995-ab49-ff090c09b29c",
      value: 600,
      type: 2,
    },
    {
      uuid: "7d8e1d94-8327-439a-aaa8-06e6818784fb",
      idc: "761a4394-4f1e-4f3e-9566-3cf1f7643b91",
      idr: "0231857b-cc25-4995-ab49-ff090c09b29c",
      value: 1200,
      type: 2,
    },
  ]);
  const [dataAlokasi, setDataAlokasi] = useState([]);
  //#endregion baseData

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs15/data/${id}/soal`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setLoad(false);

          if (!res.data.status) {
            swal({
              title: "Peringatan",
              text: res.data.message,
              icon: "error",
              closeOnClickOutside: false,
              buttons: {
                catch: {
                  text: "kembali",
                  value: "oke",
                  className: "mx-auto",
                },
              },
            }).then((value) => {
              switch (value) {
                case "oke":
                  history.goBack();
                  break;
                default:
                  return;
              }
            });
            return;
          }

          // setDataConfig(res.data.config);
          if (res.data.headers.length > 0) setHeaders(res.data.headers);
          if (res.data.departements.length > 0)
            setDepartements(res.data.departements);
          if (res.data.sections.length > 0) setSections(res.data.sections);
          if (res.data.kode.length > 0) setKode(res.data.kode);
          const kp = res.data.kpembantu.map((el, i) => ({
            ...el,
            status: el.status === 1 ? true : false,
          }));
          if (res.data.kpembantu.length > 0) setKpembantu(kp);
          if (res.data.data.length > 0) setData(res.data.data);
          setDataAlokasi(res.data.dataalokasi);
          //

          // deff soal
          if (!res.data.config.narasisoal) {
            const x = {
              ...res.data.config,
              narasisoal: "<p>Game Simulasi 15</p>\n",
            };
            setDataConfig(x);
          } else {
            setDataConfig(res.data.config);
          }

          setOri({
            dataConfig: res.data.config,
            headers: res.data.headers,
            departements: res.data.departements,
            sections: res.data.sections,
            kode: res.data.kode,
            kpembantu: kp,
            data: res.data.data,
            dataAlokasi: res.data.dataalokasi,
          });
        })
        .catch((error) => {
          setLoad(false);

          if (error.response.status === 401) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 400) {
            console.log(error.response.data.message);
            toast.error(
              "Terjadi Keslahan, Silahkan ulangi beberapa saat lagi."
            );
          } else {
            console.log(error);
            toast.error(error.response.data.message);
          }
        });
    };

    fetchData();
  }, [id, update, history]);

  const saveToDbGs15 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs15/data/update`,
      {
        idc: id,
        dataConf: dataConfig,
        headers: headers,
        departements: departements,
        sections: sections,
        kode: kode,
        kpembantu: kpembantu,
        dataAlokasi: dataAlokasi,
        data: data,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    // Notif
    toast.promise(
      push,
      {
        loading: "Menyimpan Data...",
        success: (data) => {
          setLoad(false);
          // console.log(data);
          setUpdate(update + 1);
          // message
          return data.data.message;
        },
        error: (error) => {
          setLoad(false);
          console.log(error);
          return error.response.data.message;
        },
      },
      {
        style: {
          minWidth: "250px",
          border: "1px solid #1E40AF",
          padding: "16px",
          color: "#1E40AF",
          marginBottom: "25px",
        },
        success: {
          duration: 3500,
        },
      }
    );
  };
  const cek = () => {
    if (ori && dataConfig) {
      if (
        !isEqual(ori.dataConfig, dataConfig) ||
        !isEqual(ori.headers, headers) ||
        !isEqual(ori.departements, departements) ||
        !isEqual(ori.sections, sections) ||
        !isEqual(ori.kode, kode) ||
        !isEqual(ori.kpembantu, kpembantu) ||
        !isEqual(ori.data, data) ||
        !isEqual(ori.dataAlokasi, dataAlokasi)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>GS 15 | Admin</title>
      </Helmet>
      <div className="flex flex-col items-start relative">
        <Button
          variant="contained"
          color="primary"
          className={classes.btnback}
          onClick={() => {
            history.goBack();
          }}
        >
          <ArrowBackIcon fontSize="small" className="mr-1" />
          Back
        </Button>
        <div className="relative w-full mb-5">
          <div className="text-2xl text-center w-full absolute">
            Konfigurasi Game Simulasi 15
          </div>
        </div>
      </div>
      {/* CONTAINER  */}
      <div className="relative">
        {load && <LoadingWait />}

        {/* bdy */}
        <Grid container spacing={2} direction="row" alignItems="stretch">
          <Grid item xs={12} md={12} lg={12}>
            <span className="mt-5 block">Soal Editor:</span>
            <div className="border min-h-5v">
              {ori ? (
                <EditorNarasiSoal
                  dataConfig={dataConfig}
                  setdataConfig={(dat) => setDataConfig(dat)}
                />
              ) : (
                <div className="p-3 bg-white">
                  <ShimmerTitle line={2} variant="secondary" />
                  <ShimmerText />
                </div>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <TabelManagerAdmin
              headers={headers}
              setHeaders={(x) => setHeaders(x)}
              departements={departements}
              setDepartements={(x) => setDepartements(x)}
              sections={sections}
              setSections={(x) => setSections(x)}
              kode={kode}
              setKode={(x) => setKode(x)}
              kpembantu={kpembantu}
              setKpembantu={(x) => setKpembantu(x)}
              data={data}
              setData={(x) => setData(x)}
              dataAlokasi={dataAlokasi}
              setDataAlokasi={(x) => setDataAlokasi(x)}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TabelKunciJawaban
              kode={kode}
              dasaralokasi={dataAlokasi}
              setDataAlokasi={(x) => setDataAlokasi(x)}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AdminBuktiMemorialGs15
              config={dataConfig}
              setDataConfig={(x) => setDataConfig(x)}
              dasaralokasi={dataAlokasi}
            />
          </Grid>
        </Grid>
      </div>
      <Button
        variant="contained"
        className={classes.btnaddadata}
        style={{ marginTop: "14px", marginRight: "10px" }}
        endIcon={
          load ? (
            <CircularProgress
              size={20}
              thickness={4}
              style={{ color: "white" }}
            />
          ) : (
            <Save />
          )
        }
        onClick={() => saveToDbGs15()}
        disabled={load}
      >
        Save Data
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.btnLihatPreviewMhs}
        endIcon={<OpenInNewIcon />}
        onClick={() => {
          if (cek()) {
            toast(
              (t) => (
                <div className="flex flex-col">
                  <span>
                    Terdapat perubahan data, klik save terlebih untuk menyimpan
                    perubahan.
                  </span>
                  <div>
                    <button
                      className="mt-3 cursor-pointer inline-flex bg-red-500 hover:bg-red-600 text-white rounded h-6 px-3 justify-center items-center"
                      onClick={() => {
                        toast.dismiss(t.id);
                        history.push(`${id}/preview`);
                      }}
                    >
                      Tetap lihat (batalkan perubahan)
                    </button>
                  </div>
                </div>
              ),
              {
                icon: "⚠️",
                duration: 2000,
              }
            );
            return;
          }
          history.push(`${id}/preview`);
        }}
      >
        Lihat tampilan di Mahasiswa
      </Button>
    </div>
  );
}
