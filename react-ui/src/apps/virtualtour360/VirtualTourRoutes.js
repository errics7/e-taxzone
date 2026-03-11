//#region
import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "../../utils/Protected.route"; 

const NotFound = lazy(() => import("../dashboard/pages/NotFound"));
const VirtualTourAreaConfig = lazy(() => import("./VirtualTourAreaConfig"));
const VirtualTourAreaDefaultConfig = lazy(() => import("./VirtualTourAreaDefaultConfig"));
const VirtualTourArea = lazy(() => import("./VirtualTourArea")); 
//#endregion

function VirtualTourRoutes() { 

  return (
    <Suspense fallback={<div className="text-center">Memuat...</div>}>
      <Switch>
        <ProtectedRoute allowed={["admin"]} exact path="/virtualtour/config/default/:area/:id" component={VirtualTourAreaDefaultConfig} />
        <ProtectedRoute allowed={["dosen", "admin"]} exact path="/virtualtour/:code/:id/area/config" component={VirtualTourAreaConfig} />
        <ProtectedRoute allowed={["mahasiswa", "dosen", "admin"]} exact path="/virtualtour/:code/:id/area" component={VirtualTourArea} /> 
        <Route path="*" render={() => <NotFound />} />
      </Switch>
    </Suspense>
  );
}

export default VirtualTourRoutes;
