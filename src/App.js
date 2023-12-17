import { Fragment, useEffect } from "react";
import { BrowserRouter, Route, Routes, redirect, useNavigate } from "react-router-dom";

import Login from "./views/auth/Login";
import Profile from "./views/auth/Profile";
import Home from "./views/others/Home";
import CoursePage from "./views/others/Course/CoursePage";
import ProgressIndex from "./views/others/Progress";
import ProgressGeneral from "./views/others/Progress/General";
import GeneralAdvance from "./views/others/Progress/General/components/GeneralAdvance";
import ProgressCenter from "./views/others/Progress/Center";
import TableDetail from "./views/others/Progress/Center/TableDetail";
import Settings from "./views/others/settings";
import AreaCatalog from "./views/others/settings/area";
import DivisionCatalog from "./views/others/settings/division";
import ModuleCatalog from "./views/others/settings/modulos";
import QuestionCatalog from "./views/others/settings/questions";
import PresentationCatalog from "./views/others/settings/presentation";
import UserCatalog from "./views/others/settings/user";
import AgencyCatalog from "./views/others/settings/agencia";
import RoleCatalog from "./views/others/settings/role";
import UserRoleCatalog from "./views/others/settings/userRole";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // Rutas públicas (que no requieren autenticación)

  const PublicRoutes = () => (
    <Fragment>
      <Route path="/" element={JSON.parse(localStorage.getItem("@user")) ? (<Home />) : (<Login />)} />
      <Route path="/login" element={<Login />} />
    </Fragment>
  );

  // Rutas privadas (requieren autenticación)
  const PrivateRoutes = () => {
    return(
      <Fragment>
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/avances" element={<ProgressIndex />} />
        <Route path="/avances/general" element={<ProgressGeneral />} />
        <Route path="/avances/general/detail" element={<GeneralAdvance />} />
        <Route path="/avances/centro" element={<ProgressCenter />} />
        <Route path="/avances/centro/detail" element={<TableDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/area" element={<AreaCatalog />} />
        <Route path="/settings/agency" element={<AgencyCatalog />} />
        <Route path="/settings/division" element={<DivisionCatalog />} />
        <Route path="/settings/module" element={<ModuleCatalog />} />
        <Route path="/settings/question" element={<QuestionCatalog />} />
        <Route path="/settings/presentation" element={<PresentationCatalog />} />
        <Route path="/settings/user" element={<UserCatalog />} />
        <Route path="/settings/role" element={<RoleCatalog />} />
        <Route path="/settings/user/role" element={<UserRoleCatalog />} />
      </Fragment>
    )
  }

  return (
    <main>
      <div>
        <BrowserRouter>
          <Routes>
            {PublicRoutes()}
            {PrivateRoutes()}
          </Routes>
        </BrowserRouter>
      </div>
    </main>
  );
}

export default App;