import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { isEqual } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import { CircularProgress, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import DataSoalAdmin from "../components/DataSoalAdmin";
import { Save } from "@mui/icons-material";
import TabelPreviewAdmin11 from "../components/TabelPreviewAdmin11";
import BukuPembantuBiayaAdmin from "../components/BukuPembantuBiayaAdmin";
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

export default function Gs11Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [ori, setOri] = useState(null);
  const [dataConfig, setDataConfig] = useState(null);
  //#region baseData
  const [headers, setHeaders] = useState([
    {
      uuid: uuidv4(),
      alias: "Biaya Produksi",
      colspan: 7,
      rowspan: 1,
    },
    {
      uuid: uuidv4(),
      alias: "Beban Admin & Umum",
      colspan: 1,
      rowspan: 3,
    },
    {
      uuid: uuidv4(),
      alias: "Beban Pemasaran",
      colspan: 1,
      rowspan: 3,
    },
  ]);
  const [departements, setDepartements] = useState([
    {
      uuid: uuidv4(),
      alias: "Departemen Pembantu",
      colspan: 2,
      rowspan: 1,
    },
    {
      uuid: uuidv4(),
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
      uuid: "763d36d1-4b8c-4fb2-b8ea-529f963f68bc",
      alias: "16",
      type: 1,
      status: false,
    },
    {
      uuid: "4ae3fe90-01a9-430d-be57-00d94928cc57",
      alias: "17",
      type: 1,
      status: false,
    },
    {
      uuid: "34d6d389-74a1-4dcc-a23d-c282499e2d8b",
      alias: "18",
      type: 1,
      status: false,
    },
    {
      uuid: "9a6079fc-a503-4ed1-9957-58e29f8d1b59",
      alias: "",
      type: 1,
      status: false,
    },
    {
      uuid: "0a03fe1d-717a-44bc-9954-179a63416ef8",
      alias: "6",
      type: 1,
      status: false,
    },
    {
      uuid: "f38f1717-086c-46dc-ab10-f307aa6bf3d7",
      alias: "61",
      type: 1,
      status: false,
    },
    {
      uuid: "7c28b802-71bb-4acf-bda6-df03aa5d97b2",
      alias: "62",
      type: 1,
      status: false,
    },
    {
      uuid: "bb17f9f5-d879-486f-9897-fdbb589999ec",
      alias: "63",
      type: 1,
      status: false,
    },
    {
      uuid: "e01c4fb2-0740-4972-ab95-65ca06ab173b",
      alias: "64",
      type: 1,
      status: false,
    },
  ]);
  const [data, setData] = useState([
    {
      uuid: "b4cf213d-f8f8-41c1-97e1-224bb81999ac",
      idc: "90fe68d9-3423-4c24-b0b8-e2b8c1783325",
      idr: "a9fc5025-f511-4864-8a99-9359d59638fa",
      value: 3000,
      keterangan: "Produksi - sie pulp",
      type: 1,
    },
    {
      uuid: "a67e5623-d426-4bf6-a3f2-4a07232d63d0",
      idc: "7eba21ba-023c-4e8a-a7fa-82595758f3ea",
      idr: "3bed54c6-8573-4421-ae29-5eb2e14297dc",
      value: 12000,
      keterangan: "Produksi - sie pulp",
      type: 1,
    },
    {
      uuid: "cfa5398d-199f-4c10-a59b-4f94c5da41c5",
      idc: "fbd120c0-f88c-4621-b05e-1a5b89173889",
      idr: "f38f1717-086c-46dc-ab10-f307aa6bf3d7",
      value: 5000,
      keterangan: "Produksi - sie pulp",
      type: 1,
    },
  ]);

  //#endregion baseData
  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs11/data/${id}/soal`, {
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
          //

          // deff soal
          if (!res.data.config.narasisoal) {
            const x = {
              ...res.data.config,
              narasisoal:
                '<p style="text-align:center;">&nbsp;<span style="color: black;background-color: rgb(255,255,255);font-size: 16px;font-family: Calibri;"><strong>REKAPITULASI DAN ALOKASI BIAYA PRODUKSI</strong></span><span style="font-size: 16px;"> </span></p>\n<p style="text-align:left;"><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Pada sesi games ini, mahasiswa menghitung dan mengisi baris 71 dengan data dasar alokasi yang telah ditampilkan </span></p>\n',
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
          });
        })
        .catch((error) => {
          setLoad(false);
          console.log(error);

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
  }, [id, history, update]);

  const saveToDbGs11 = () => {
    // console.log("k", JSON.stringify(kpembantu));
    // console.log("d", JSON.stringify(data));
    // return;
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs11/data/update`,
      {
        idc: id,
        dataConf: dataConfig,
        headers: headers,
        departements: departements,
        sections: sections,
        kode: kode,
        kpembantu: kpembantu,
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
        loading: "Simpan Data...",
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
        !isEqual(ori.data, data)
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
        <title>GS 11 | Admin</title>
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
            Konfigurasi Game Simulasi 11
          </div>
        </div>
      </div>
      {/* CONTAINER  */}
      <div className="relative">
        {load && <LoadingWait />}
        <br />

        <Grid container spacing={2} direction="row" alignItems="stretch">
          <Grid item xs={12} md={12} lg={12}>
            <span className="mt-5 block">Soal Editor:</span>
            <div className="border min-h-5v">
              {dataConfig ? (
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
            <TabelPreviewAdmin11
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
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <DataSoalAdmin
              kode={kode}
              kpembantu={kpembantu}
              data={data}
              setData={(d) => setData(d)}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <BukuPembantuBiayaAdmin
              kode={kode}
              kpembantu={kpembantu}
              data={data}
              setData={(d) => setData(d)}
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
        onClick={() => {
          saveToDbGs11();
        }}
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
