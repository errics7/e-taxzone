import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProtectedRoute } from "../../../utils/Protected.route";

const HomeGameSimulasiMhs = lazy(() => import("./HomeGameSimulasiMhs"));
const GameOOP = lazy(() => import("../component/QuestionOOP"));
const QuizResultMhs = lazy(() => import("../component/QuizResult"));

const VirtualTourHomeMhs = lazy(() => import("./VirtualTourHomeMhs"));

const Gs1Mnf = lazy(() => import("../../gamesimulasi/gs1/pages/Gs1PreviewMahasiswa"));
const Gs2Mnf = lazy(() => import("../../gamesimulasi/gs2/pages/Gs2PreviewMahasiswa"));
const Gs3Mnf = lazy(() => import("../../gamesimulasi/gs3/pages/Gs3PreviewMahasiswa"));
const Gs4Mnf = lazy(() => import("../../gamesimulasi/gs4/pages/Gs4PreviewMahasiswa"));
const Gs5Mnf = lazy(() => import("../../gamesimulasi/gs5/pages/Gs5PreviewMahasiswa"));
const Gs6Mnf = lazy(() => import("../../gamesimulasi/gs6/pages/Gs6PreviewMahasiswa"));
const Gs7Mnf = lazy(() => import("../../gamesimulasi/gs7/pages/Gs7PreviewMahasiswa"));
const Gs8Mnf = lazy(() => import("../../gamesimulasi/gs8/pages/Gs8PreviewMahasiswa"));
const Gs9Mnf = lazy(() => import("../../gamesimulasi/gs9/pages/Gs9PreviewMahasiswa"));
const Gs10Mnf = lazy(() => import("../../gamesimulasi/gs10/pages/Gs10PreviewMahasiswa"));
const Gs11Mnf = lazy(() => import("../../gamesimulasi/gs11/pages/Gs11PreviewMahasiswa"));
const Gs12Mnf = lazy(() => import("../../gamesimulasi/gs12/pages/Gs12PreviewMahasiswa"));
const Gs13Mnf = lazy(() => import("../../gamesimulasi/gs13/pages/Gs13PreviewMahasiswa"));
const Gs14Mnf = lazy(() => import("../../gamesimulasi/gs14/pages/Gs14PreviewMahasiswa"));
const Gs15Mnf = lazy(() => import("../../gamesimulasi/gs15/pages/Gs15PreviewMahasiswa"));
const Gs16Mnf = lazy(() => import("../../gamesimulasi/gs16/pages/Gs16PreviewMahasiswa"));
const Gs17Mnf = lazy(() => import("../../gamesimulasi/gs17/pages/Gs17PreviewMahasiswa"));
const Gs18Mnf = lazy(() => import("../../gamesimulasi/gs18/pages/Gs18PreviewMahasiswa"));
const Gs1Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs1/pages/Gs1Mhs"));
const Gs2Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs2/pages/Gs2Mhs"));
const Gs3Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs3/pages/Gs3Mhs"));
const Gs4Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs4/pages/Gs4Mhs"));
const Gs5Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs5/pages/Gs5Mhs"));
const Gs6Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs6/pages/Gs6Mhs"));
const Gs7Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs7/pages/Gs7Mhs"));
const Gs8Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs8/pages/Gs8Mhs"));
const Gs9Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs9/pages/Gs9Mhs"));
const Gs10Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs10/pages/Gs10Mhs"));
const Gs11Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs11/pages/Gs11Mhs"));
const Gs12Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs12/pages/Gs12Mhs"));
const Gs13Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs13/pages/Gs13Mhs"));
const Gs14Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs14/pages/Gs14Mhs"));
const Gs15Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs15/pages/Gs15Mhs"));
const Gs16Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs16/pages/Gs16Mhs"));
const Gs17Prdg = lazy(() => import("../../gamesimulasi_perdagangan/gs17/pages/Gs17Mhs"));

export default function FRouter(props) {
  const scene = useSelector((state) => state.scen);

  return (
    <div className="w-full bg-white min-h-1/2 rounded">
      <Suspense fallback={<div className="text-center">Memuat...</div>}>
        <Switch>
          <ProtectedRoute exact path="/home/f/:code/gssimulasi" allowed={["mahasiswa"]} component={HomeGameSimulasiMhs} />
          <ProtectedRoute exact path="/home/f/:code/gssimulasi/:id" allowed={["mahasiswa"]} component={GameOOP} />
          <ProtectedRoute exact path="/home/f/:code/results/:id" allowed={["mahasiswa"]} component={QuizResultMhs} />

          <ProtectedRoute exact path="/home/f/:code/virtualtour" allowed={["mahasiswa"]} component={VirtualTourHomeMhs} />

          <ProtectedRoute exact path="/home/f/:code/gs1-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs1Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs2-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs2Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs3-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs3Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs4-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs4Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs5-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs5Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs6-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs6Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs7-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs7Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs8-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs8Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs9-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs9Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs10-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs10Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs11-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs11Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs12-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs12Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs13-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs13Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs14-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs14Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs15-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs15Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs16-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs16Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs17-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs17Mnf} />
          <ProtectedRoute exact path="/home/f/:code/gs18-manufaktur/:id" allowed={["mahasiswa", "admin"]} component={Gs18Mnf} />
          {/* disini tambah LembarKerjaMahasiswa */}
          <ProtectedRoute exact path="/home/f/:code/gs1-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs1Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs2-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs2Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs3-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs3Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs4-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs4Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs5-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs5Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs6-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs6Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs7-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs7Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs8-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs8Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs9-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs9Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs10-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs10Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs11-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs11Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs12-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs12Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs13-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs13Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs14-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs14Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs15-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs15Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs16-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs16Prdg} />
          <ProtectedRoute exact path="/home/f/:code/gs17-perdagangan/:id" allowed={["mahasiswa", "admin"]} component={Gs17Prdg} />
          {/* Disini update kelas gs */}
          <Route path="*" render={() => <Redirect to={`/home/spt-tahunan`} />} />
        </Switch>
      </Suspense>
    </div>
  );
}
