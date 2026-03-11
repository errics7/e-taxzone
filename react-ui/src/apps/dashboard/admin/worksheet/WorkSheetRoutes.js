import { Route, Switch, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";

import WorksheetList from "./WorksheetList";
import Gs1Admin from "../../../gamesimulasi/gs1/pages/Gs1Admin";
import Gs1PreviewMahasiswa from "../../../gamesimulasi/gs1/pages/Gs1PreviewMahasiswa";
import Gs2Admin from "../../../gamesimulasi/gs2/pages/Gs2Admin";
import Gs2PrevMhs from "../../../gamesimulasi/gs2/pages/Gs2PreviewMahasiswa";
import Gs3Admin from "../../../gamesimulasi/gs3/pages/Gs3Admin";
import Gs3PrevMhs from "../../../gamesimulasi/gs3/pages/Gs3PreviewMahasiswa";
import Gs4Admin from "../../../gamesimulasi/gs4/pages/Gs4Admin";
import Gs4PreviewMahasiswa from "../../../gamesimulasi/gs4/pages/Gs4PreviewMahasiswa";
import Gs5Admin from "../../../gamesimulasi/gs5/pages/Gs5Admin";
import Gs5PreviewMahasiswa from "../../../gamesimulasi/gs5/pages/Gs5PreviewMahasiswa";
import Gs6Admin from "../../../gamesimulasi/gs6/pages/Gs6Admin";
import Gs6PreviewMahasiswa from "../../../gamesimulasi/gs6/pages/Gs6PreviewMahasiswa";
import Gs7Admin from "../../../gamesimulasi/gs7/pages/Gs7Admin";
import Gs7PreviewMahasiswa from "../../../gamesimulasi/gs7/pages/Gs7PreviewMahasiswa";
import Gs8Admin from "../../../gamesimulasi/gs8/pages/Gs8Admin";
import Gs8PreviewMahasiswa from "../../../gamesimulasi/gs8/pages/Gs8PreviewMahasiswa";
import Gs9Admin from "../../../gamesimulasi/gs9/pages/Gs9Admin";
import Gs9PreviewMahasiswa from "../../../gamesimulasi/gs9/pages/Gs9PreviewMahasiswa";
import Gs10Admin from "../../../gamesimulasi/gs10/pages/Gs10Admin";
import Gs10PreviewMahasiswa from "../../../gamesimulasi/gs10/pages/Gs10PreviewMahasiswa";
import Gs11Admin from "../../../gamesimulasi/gs11/pages/Gs11Admin";
import Gs11PreviewMahasiswa from "../../../gamesimulasi/gs11/pages/Gs11PreviewMahasiswa";
import Gs12PreviewMahasiswa from "../../../gamesimulasi/gs12/pages/Gs12PreviewMahasiswa";
import Gs12Adminv2 from "../../../gamesimulasi/gs12/pages/Gs12Adminv2";
import Gs13PreviewMahasiswa from "../../../gamesimulasi/gs13/pages/Gs13PreviewMahasiswa";
import Gs13Admin from "../../../gamesimulasi/gs13/pages/Gs13Admin";
import Gs15PreviewMahasiswa from "../../../gamesimulasi/gs15/pages/Gs15PreviewMahasiswa";
import Gs15Admin from "../../../gamesimulasi/gs15/pages/Gs15Admin";
import Gs16Admin from "../../../gamesimulasi/gs16/pages/Gs16Admin";
import Gs16PreviewMahasiswa from "../../../gamesimulasi/gs16/pages/Gs16PreviewMahasiswa";
import Gs17Admin from "../../../gamesimulasi/gs17/pages/Gs17Admin";
import Gs17PreviewMahasiswa from "../../../gamesimulasi/gs17/pages/Gs17PreviewMahasiswa";
import Gs18PreviewMahasiswa from "../../../gamesimulasi/gs18/pages/Gs18PreviewMahasiswa";
import Gs18Admin from "../../../gamesimulasi/gs18/pages/Gs18Admin";
import Gs14Admin from "../../../gamesimulasi/gs14/pages/Gs14Admin";
import Gs14PreviewMahasiswa from "../../../gamesimulasi/gs14/pages/Gs14PreviewMahasiswa";
//
import GsPrdg1Admin from "../../../gamesimulasi_perdagangan/gs1/pages/Gs1Admin";
import GsPrdg1Mhs from "../../../gamesimulasi_perdagangan/gs1/pages/Gs1Mhs";
import GsPrdg2Admin from "../../../gamesimulasi_perdagangan/gs2/pages/Gs2Admin";
import GsPrdg2Mhs from "../../../gamesimulasi_perdagangan/gs2/pages/Gs2Mhs";
import GsPrdg3Admin from "../../../gamesimulasi_perdagangan/gs3/pages/Gs3Admin";
import GsPrdg3Mhs from "../../../gamesimulasi_perdagangan/gs3/pages/Gs3Mhs";
import GsPrdg4Admin from "../../../gamesimulasi_perdagangan/gs4/pages/Gs4Admin";
import GsPrdg4Mhs from "../../../gamesimulasi_perdagangan/gs4/pages/Gs4Mhs";
import GsPrdg5Admin from "../../../gamesimulasi_perdagangan/gs5/pages/Gs5Admin";
import GsPrdg5Mhs from "../../../gamesimulasi_perdagangan/gs5/pages/Gs5Mhs";
import GsPrdg6Admin from "../../../gamesimulasi_perdagangan/gs6/pages/Gs6Admin";
import GsPrdg6Mhs from "../../../gamesimulasi_perdagangan/gs6/pages/Gs6Mhs";

import GsPrdg8Admin from "../../../gamesimulasi_perdagangan/gs8/pages/Gs8Admin";
import GsPrdg8Mhs from "../../../gamesimulasi_perdagangan/gs8/pages/Gs8Mhs";
import GsPrdg9Admin from "../../../gamesimulasi_perdagangan/gs9/pages/Gs9Admin";
import GsPrdg9Mhs from "../../../gamesimulasi_perdagangan/gs9/pages/Gs9Mhs";
import GsPrdg10Admin from "../../../gamesimulasi_perdagangan/gs10/pages/Gs10Admin";
import GsPrdg10Mhs from "../../../gamesimulasi_perdagangan/gs10/pages/Gs10Mhs";
import GsPrdg11Admin from "../../../gamesimulasi_perdagangan/gs11/pages/Gs11Admin";
import GsPrdg11Mhs from "../../../gamesimulasi_perdagangan/gs11/pages/Gs11Mhs";
import GsPrdg12Admin from "../../../gamesimulasi_perdagangan/gs12/pages/Gs12Admin";
import GsPrdg12Mhs from "../../../gamesimulasi_perdagangan/gs12/pages/Gs12Mhs";
import GsPrdg13Admin from "../../../gamesimulasi_perdagangan/gs13/pages/Gs13Admin";
import GsPrdg13Mhs from "../../../gamesimulasi_perdagangan/gs13/pages/Gs13Mhs";
import GsPrdg14Admin from "../../../gamesimulasi_perdagangan/gs14/pages/Gs14Admin";
import GsPrdg14Mhs from "../../../gamesimulasi_perdagangan/gs14/pages/Gs14Mhs";
import GsPrdg15Admin from "../../../gamesimulasi_perdagangan/gs15/pages/Gs15Admin";
import GsPrdg15Mhs from "../../../gamesimulasi_perdagangan/gs15/pages/Gs15Mhs";
import GsPrdg16Admin from "../../../gamesimulasi_perdagangan/gs16/pages/Gs16Admin";
import GsPrdg16Mhs from "../../../gamesimulasi_perdagangan/gs16/pages/Gs16Mhs";
import GsPrdg17Admin from "../../../gamesimulasi_perdagangan/gs17/pages/Gs17Admin";
import GsPrdg17Mhs from "../../../gamesimulasi_perdagangan/gs17/pages/Gs17Mhs";

export default function WorkSheetRoutes() {
  return (
    <div className="w-full bg-white min-h-1/2 rounded p-5">
      <Helmet>
        <title>WorkSheet | Admin</title>
      </Helmet>
      <br />
      <Switch>
        <Route exact path="/admin/worksheet" component={WorksheetList} />
        <Route exact path="/admin/worksheet/gs1/:id" component={Gs1Admin} />
        <Route exact path="/admin/worksheet/gs1/:id/preview" component={Gs1PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs2/:id" component={Gs2Admin} />
        <Route exact path="/admin/worksheet/gs2/:id/preview" component={Gs2PrevMhs} />
        <Route exact path="/admin/worksheet/gs3/:id" component={Gs3Admin} />
        <Route exact path="/admin/worksheet/gs3/:id/preview" component={Gs3PrevMhs} />
        <Route exact path="/admin/worksheet/gs4/:id" component={Gs4Admin} />
        <Route exact path="/admin/worksheet/gs4/:id/preview" component={Gs4PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs5/:id" component={Gs5Admin} />
        <Route exact path="/admin/worksheet/gs5/:id/preview" component={Gs5PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs6/:id" component={Gs6Admin} />
        <Route exact path="/admin/worksheet/gs6/:id/preview" component={Gs6PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs7/:id" component={Gs7Admin} />
        <Route exact path="/admin/worksheet/gs7/:id/preview" component={Gs7PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs8/:id" component={Gs8Admin} />
        <Route exact path="/admin/worksheet/gs8/:id/preview" component={Gs8PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs9/:id" component={Gs9Admin} />
        <Route exact path="/admin/worksheet/gs9/:id/preview" component={Gs9PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs10/:id" component={Gs10Admin} />
        <Route exact path="/admin/worksheet/gs10/:id/preview" component={Gs10PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs11/:id" component={Gs11Admin} />
        <Route exact path="/admin/worksheet/gs11/:id/preview" component={Gs11PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs12/:id" component={Gs12Adminv2} />
        <Route exact path="/admin/worksheet/gs12v2/:id" component={Gs12Adminv2} />
        <Route exact path="/admin/worksheet/gs12/:id/preview" component={Gs12PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs13/:id" component={Gs13Admin} />
        <Route exact path="/admin/worksheet/gs13/:id/preview" component={Gs13PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs14/:id" component={Gs14Admin} />
        <Route exact path="/admin/worksheet/gs14/:id/preview" component={Gs14PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs15/:id" component={Gs15Admin} />
        <Route exact path="/admin/worksheet/gs15/:id/preview" component={Gs15PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs16/:id" component={Gs16Admin} />
        <Route exact path="/admin/worksheet/gs16/:id/preview" component={Gs16PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs17/:id" component={Gs17Admin} />
        <Route exact path="/admin/worksheet/gs17/:id/preview" component={Gs17PreviewMahasiswa} />
        <Route exact path="/admin/worksheet/gs18/:id" component={Gs18Admin} />
        <Route exact path="/admin/worksheet/gs18/:id/preview" component={Gs18PreviewMahasiswa} />
        {/* PERDAGANGAN */}
        <Route exact path="/admin/worksheet/perdagangan1/:id" component={GsPrdg1Admin} />
        <Route exact path="/admin/worksheet/perdagangan1/:id/preview" component={GsPrdg1Mhs} />
        <Route exact path="/admin/worksheet/perdagangan2/:id" component={GsPrdg2Admin} />
        <Route exact path="/admin/worksheet/perdagangan2/:id/preview" component={GsPrdg2Mhs} />
        <Route exact path="/admin/worksheet/perdagangan3/:id" component={GsPrdg3Admin} />
        <Route exact path="/admin/worksheet/perdagangan3/:id/preview" component={GsPrdg3Mhs} />
        <Route exact path="/admin/worksheet/perdagangan4/:id" component={GsPrdg4Admin} />
        <Route exact path="/admin/worksheet/perdagangan4/:id/preview" component={GsPrdg4Mhs} />
        <Route exact path="/admin/worksheet/perdagangan5/:id" component={GsPrdg5Admin} />
        <Route exact path="/admin/worksheet/perdagangan5/:id/preview" component={GsPrdg5Mhs} />
        <Route exact path="/admin/worksheet/perdagangan6/:id" component={GsPrdg6Admin} />
        <Route exact path="/admin/worksheet/perdagangan6/:id/preview" component={GsPrdg6Mhs} />
        <Route exact path="/admin/worksheet/perdagangan8/:id" component={GsPrdg8Admin} />
        <Route exact path="/admin/worksheet/perdagangan8/:id/preview" component={GsPrdg8Mhs} />
        <Route exact path="/admin/worksheet/perdagangan9/:id" component={GsPrdg9Admin} />
        <Route exact path="/admin/worksheet/perdagangan9/:id/preview" component={GsPrdg9Mhs} />
        <Route exact path="/admin/worksheet/perdagangan10/:id" component={GsPrdg10Admin} />
        <Route exact path="/admin/worksheet/perdagangan10/:id/preview" component={GsPrdg10Mhs} />
        <Route exact path="/admin/worksheet/perdagangan11/:id" component={GsPrdg11Admin} />
        <Route exact path="/admin/worksheet/perdagangan11/:id/preview" component={GsPrdg11Mhs} />
        <Route exact path="/admin/worksheet/perdagangan12/:id" component={GsPrdg12Admin} />
        <Route exact path="/admin/worksheet/perdagangan12/:id/preview" component={GsPrdg12Mhs} />
        <Route exact path="/admin/worksheet/perdagangan13/:id" component={GsPrdg13Admin} />
        <Route exact path="/admin/worksheet/perdagangan13/:id/preview" component={GsPrdg13Mhs} />
        <Route exact path="/admin/worksheet/perdagangan14/:id" component={GsPrdg14Admin} />
        <Route exact path="/admin/worksheet/perdagangan14/:id/preview" component={GsPrdg14Mhs} />
        <Route exact path="/admin/worksheet/perdagangan15/:id" component={GsPrdg15Admin} />
        <Route exact path="/admin/worksheet/perdagangan15/:id/preview" component={GsPrdg15Mhs} />
        <Route exact path="/admin/worksheet/perdagangan16/:id" component={GsPrdg16Admin} />
        <Route exact path="/admin/worksheet/perdagangan16/:id/preview" component={GsPrdg16Mhs} />
        <Route exact path="/admin/worksheet/perdagangan17/:id" component={GsPrdg17Admin} />
        <Route exact path="/admin/worksheet/perdagangan17/:id/preview" component={GsPrdg17Mhs} />

        <Route path="*" render={() => <Redirect to="/admin/worksheet" />} />
      </Switch>
    </div>
  );
}
