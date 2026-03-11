import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
const WorksheetDataList = lazy(() => import("../component/WorksheetDataList"));
const CreateQuestion = lazy(() => import("../component/management-question/Question"));
const VirtualTourDataListDosen = lazy(() => import("./VirtualTourDataListDosen"));
//#region  
const Gs1MnfAdm = lazy(() => import("../../gamesimulasi/gs1/pages/Gs1Admin"));
const Gs1MnfMhs = lazy(() => import("../../gamesimulasi/gs1/pages/Gs1PreviewMahasiswa"));
const Gs2MnfAdm = lazy(() => import("../../gamesimulasi/gs2/pages/Gs2Admin"));
const Gs2MnfMhs = lazy(() => import("../../gamesimulasi/gs2/pages/Gs2PreviewMahasiswa"));
const Gs3MnfAdm = lazy(() => import("../../gamesimulasi/gs3/pages/Gs3Admin"));
const Gs3MnfMhs = lazy(() => import("../../gamesimulasi/gs3/pages/Gs3PreviewMahasiswa"));
const Gs4MnfAdm = lazy(() => import("../../gamesimulasi/gs4/pages/Gs4Admin"));
const Gs4Mnfmhs = lazy(() => import("../../gamesimulasi/gs4/pages/Gs4PreviewMahasiswa"));
const Gs5MnfAdm = lazy(() => import("../../gamesimulasi/gs5/pages/Gs5Admin"));
const Gs5MnfMhs = lazy(() => import("../../gamesimulasi/gs5/pages/Gs5PreviewMahasiswa"));
const Gs6MnfAdm = lazy(() => import("../../gamesimulasi/gs6/pages/Gs6Admin"));
const Gs6MnfMhs = lazy(() => import("../../gamesimulasi/gs6/pages/Gs6PreviewMahasiswa"));
const Gs7MnfAdm = lazy(() => import("../../gamesimulasi/gs7/pages/Gs7Admin"));
const Gs7MnfMhs = lazy(() => import("../../gamesimulasi/gs7/pages/Gs7PreviewMahasiswa"));
const Gs8MnfAdm = lazy(() => import("../../gamesimulasi/gs8/pages/Gs8Admin"));
const Gs8MnfMhs = lazy(() => import("../../gamesimulasi/gs8/pages/Gs8PreviewMahasiswa"));
const Gs9MnfAdm = lazy(() => import("../../gamesimulasi/gs9/pages/Gs9Admin"));
const Gs9MnfMhs = lazy(() => import("../../gamesimulasi/gs9/pages/Gs9PreviewMahasiswa"));
const Gs10MnfAdm = lazy(() => import("../../gamesimulasi/gs10/pages/Gs10Admin"));
const Gs10MnfMhs = lazy(() => import("../../gamesimulasi/gs10/pages/Gs10PreviewMahasiswa"));
const Gs11MnfAdm = lazy(() => import("../../gamesimulasi/gs11/pages/Gs11Admin"));
const Gs11MnfMhs = lazy(() => import("../../gamesimulasi/gs11/pages/Gs11PreviewMahasiswa"));
const Gs12MnfAdm = lazy(() => import("../../gamesimulasi/gs12/pages/Gs12Adminv2"));
const Gs12MnfMhs = lazy(() => import("../../gamesimulasi/gs12/pages/Gs12PreviewMahasiswa"));
const Gs13MnfAdm = lazy(() => import("../../gamesimulasi/gs13/pages/Gs13Admin"));
const Gs13MnfMhs = lazy(() => import("../../gamesimulasi/gs13/pages/Gs13PreviewMahasiswa"));
const Gs14MnfAdm = lazy(() => import("../../gamesimulasi/gs14/pages/Gs14Admin"));
const Gs14MnfMhs = lazy(() => import("../../gamesimulasi/gs14/pages/Gs14PreviewMahasiswa"));
const Gs15MnfAdm = lazy(() => import("../../gamesimulasi/gs15/pages/Gs15Admin"));
const Gs15MnfMhs = lazy(() => import("../../gamesimulasi/gs15/pages/Gs15PreviewMahasiswa"));
const Gs16MnfAdm = lazy(() => import("../../gamesimulasi/gs16/pages/Gs16Admin"));
const Gs16MnfMhs = lazy(() => import("../../gamesimulasi/gs16/pages/Gs16PreviewMahasiswa"));
const Gs17MnfAdm = lazy(() => import("../../gamesimulasi/gs17/pages/Gs17Admin"));
const Gs17MnfMhs = lazy(() => import("../../gamesimulasi/gs17/pages/Gs17PreviewMahasiswa"));
const Gs18MnfAdm = lazy(() => import("../../gamesimulasi/gs18/pages/Gs18Admin"));
const Gs18MnfMhs = lazy(() => import("../../gamesimulasi/gs18/pages/Gs18PreviewMahasiswa"));

const GsPrdg1Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs1/pages/Gs1Admin"));
const GsPrdg1Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs1/pages/Gs1Mhs"));
const GsPrdg2Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs2/pages/Gs2Admin"));
const GsPrdg2Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs2/pages/Gs2Mhs"));
const GsPrdg3Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs3/pages/Gs3Admin"));
const GsPrdg3Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs3/pages/Gs3Mhs"));
const GsPrdg4Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs4/pages/Gs4Admin"));
const GsPrdg4Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs4/pages/Gs4Mhs"));
const GsPrdg5Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs5/pages/Gs5Admin"));
const GsPrdg5Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs5/pages/Gs5Mhs"));
const GsPrdg6Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs6/pages/Gs6Admin"));
const GsPrdg6Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs6/pages/Gs6Mhs"));
const GsPrdg7Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs7/pages/Gs7Admin"));
const GsPrdg7Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs7/pages/Gs7Mhs"));
const GsPrdg8Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs8/pages/Gs8Admin"));
const GsPrdg8Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs8/pages/Gs8Mhs"));
const GsPrdg9Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs9/pages/Gs9Admin"));
const GsPrdg9Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs9/pages/Gs9Mhs"));
const GsPrdg10Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs10/pages/Gs10Admin"));
const GsPrdg10Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs10/pages/Gs10Mhs"));
const GsPrdg11Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs11/pages/Gs11Admin"));
const GsPrdg11Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs11/pages/Gs11Mhs"));
const GsPrdg12Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs12/pages/Gs12Admin"));
const GsPrdg12Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs12/pages/Gs12Mhs"));
const GsPrdg13Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs13/pages/Gs13Admin"));
const GsPrdg13Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs13/pages/Gs13Mhs"));
const GsPrdg14Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs14/pages/Gs14Admin"));
const GsPrdg14Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs14/pages/Gs14Mhs"));
const GsPrdg15Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs15/pages/Gs15Admin"));
const GsPrdg15Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs15/pages/Gs15Mhs"));
const GsPrdg16Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs16/pages/Gs16Admin"));
const GsPrdg16Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs16/pages/Gs16Mhs"));
const GsPrdg17Admin = lazy(() => import("../../gamesimulasi_perdagangan/gs17/pages/Gs17Admin"));
const GsPrdg17Mhs = lazy(() => import("../../gamesimulasi_perdagangan/gs17/pages/Gs17Mhs"));

//#endregion

export default function WorkSheetRoutes() {
  const scene = useSelector((state) => state.scen);

  return (
    <div className="w-full min-h-1/2">
      <Helmet>
        <title>Skenario Kontrol | Dosen</title>
      </Helmet>
      <Suspense fallback={<div className="text-center">Memuat...</div>}>
        <Switch>
          <Route exact path="/dosen/sc/:code/gssimulasi" component={WorksheetDataList} />
          <Route exact path="/dosen/sc/:code/virtualtour" component={VirtualTourDataListDosen} />
          <Route exact path="/dosen/sc/create-question/:id" component={CreateQuestion} />

          <Route exact path="/dosen/sc/:code/gs1-manufaktur/:id" component={Gs1MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs1-manufaktur/:id/preview" component={Gs1MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs2-manufaktur/:id" component={Gs2MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs2-manufaktur/:id/preview" component={Gs2MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs3-manufaktur/:id" component={Gs3MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs3-manufaktur/:id/preview" component={Gs3MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs4-manufaktur/:id" component={Gs4MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs4-manufaktur/:id/preview" component={Gs4Mnfmhs} />
          <Route exact path="/dosen/sc/:code/gs5-manufaktur/:id" component={Gs5MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs5-manufaktur/:id/preview" component={Gs5MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs6-manufaktur/:id" component={Gs6MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs6-manufaktur/:id/preview" component={Gs6MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs7-manufaktur/:id" component={Gs7MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs7-manufaktur/:id/preview" component={Gs7MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs8-manufaktur/:id" component={Gs8MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs8-manufaktur/:id/preview" component={Gs8MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs9-manufaktur/:id" component={Gs9MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs9-manufaktur/:id/preview" component={Gs9MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs10-manufaktur/:id" component={Gs10MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs10-manufaktur/:id/preview" component={Gs10MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs11-manufaktur/:id" component={Gs11MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs11-manufaktur/:id/preview" component={Gs11MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs12-manufaktur/:id" component={Gs12MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs12-manufaktur/:id/preview" component={Gs12MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs13-manufaktur/:id" component={Gs13MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs13-manufaktur/:id/preview" component={Gs13MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs14-manufaktur/:id" component={Gs14MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs14-manufaktur/:id/preview" component={Gs14MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs15-manufaktur/:id" component={Gs15MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs15-manufaktur/:id/preview" component={Gs15MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs16-manufaktur/:id" component={Gs16MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs16-manufaktur/:id/preview" component={Gs16MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs17-manufaktur/:id" component={Gs17MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs17-manufaktur/:id/preview" component={Gs17MnfMhs} />
          <Route exact path="/dosen/sc/:code/gs18-manufaktur/:id" component={Gs18MnfAdm} />
          <Route exact path="/dosen/sc/:code/gs18-manufaktur/:id/preview" component={Gs18MnfMhs} />
          {/* PERDAGANGAN */}
          <Route exact path="/dosen/sc/:code/gs1-perdagangan/:id" component={GsPrdg1Admin} />
          <Route exact path="/dosen/sc/:code/gs1-perdagangan/:id/preview" component={GsPrdg1Mhs} />
          <Route exact path="/dosen/sc/:code/gs2-perdagangan/:id" component={GsPrdg2Admin} />
          <Route exact path="/dosen/sc/:code/gs2-perdagangan/:id/preview" component={GsPrdg2Mhs} />
          <Route exact path="/dosen/sc/:code/gs3-perdagangan/:id" component={GsPrdg3Admin} />
          <Route exact path="/dosen/sc/:code/gs3-perdagangan/:id/preview" component={GsPrdg3Mhs} />
          <Route exact path="/dosen/sc/:code/gs4-perdagangan/:id" component={GsPrdg4Admin} />
          <Route exact path="/dosen/sc/:code/gs4-perdagangan/:id/preview" component={GsPrdg4Mhs} />
          <Route exact path="/dosen/sc/:code/gs5-perdagangan/:id" component={GsPrdg5Admin} />
          <Route exact path="/dosen/sc/:code/gs5-perdagangan/:id/preview" component={GsPrdg5Mhs} />
          <Route exact path="/dosen/sc/:code/gs6-perdagangan/:id" component={GsPrdg6Admin} />
          <Route exact path="/dosen/sc/:code/gs6-perdagangan/:id/preview" component={GsPrdg6Mhs} />
          <Route exact path="/dosen/sc/:code/gs7-perdagangan/:id" component={GsPrdg7Admin} />
          <Route exact path="/dosen/sc/:code/gs7-perdagangan/:id/preview" component={GsPrdg7Mhs} />
          <Route exact path="/dosen/sc/:code/gs8-perdagangan/:id" component={GsPrdg8Admin} />
          <Route exact path="/dosen/sc/:code/gs8-perdagangan/:id/preview" component={GsPrdg8Mhs} />
          <Route exact path="/dosen/sc/:code/gs9-perdagangan/:id" component={GsPrdg9Admin} />
          <Route exact path="/dosen/sc/:code/gs9-perdagangan/:id/preview" component={GsPrdg9Mhs} />
          <Route exact path="/dosen/sc/:code/gs10-perdagangan/:id" component={GsPrdg10Admin} />
          <Route exact path="/dosen/sc/:code/gs10-perdagangan/:id/preview" component={GsPrdg10Mhs} />
          <Route exact path="/dosen/sc/:code/gs11-perdagangan/:id" component={GsPrdg11Admin} />
          <Route exact path="/dosen/sc/:code/gs11-perdagangan/:id/preview" component={GsPrdg11Mhs} />
          <Route exact path="/dosen/sc/:code/gs12-perdagangan/:id" component={GsPrdg12Admin} />
          <Route exact path="/dosen/sc/:code/gs12-perdagangan/:id/preview" component={GsPrdg12Mhs} />
          <Route exact path="/dosen/sc/:code/gs13-perdagangan/:id" component={GsPrdg13Admin} />
          <Route exact path="/dosen/sc/:code/gs13-perdagangan/:id/preview" component={GsPrdg13Mhs} />
          <Route exact path="/dosen/sc/:code/gs14-perdagangan/:id" component={GsPrdg14Admin} />
          <Route exact path="/dosen/sc/:code/gs14-perdagangan/:id/preview" component={GsPrdg14Mhs} />
          <Route exact path="/dosen/sc/:code/gs15-perdagangan/:id" component={GsPrdg15Admin} />
          <Route exact path="/dosen/sc/:code/gs15-perdagangan/:id/preview" component={GsPrdg15Mhs} />
          <Route exact path="/dosen/sc/:code/gs16-perdagangan/:id" component={GsPrdg16Admin} />
          <Route exact path="/dosen/sc/:code/gs16-perdagangan/:id/preview" component={GsPrdg16Mhs} />
          <Route exact path="/dosen/sc/:code/gs17-perdagangan/:id" component={GsPrdg17Admin} />
          <Route exact path="/dosen/sc/:code/gs17-perdagangan/:id/preview" component={GsPrdg17Mhs} />

          <Route path="*" render={() => <Redirect to={`/dosen/sc/${scene.selectedcode}/gssimulasi`} />} />
        </Switch>
      </Suspense>
    </div>
  );
}
