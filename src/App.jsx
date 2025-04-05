import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import LogInPage from "./pages/LogInPage";
import SchedulePage from "./pages/SchedulePage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import DocentesPage from "./pages/DocentesPage";
import EscolasPage from "./pages/EscolasPage";
import SalasPage from "./pages/SalasPage"; 
import CursosPage from "./pages/CursosPage";
import ManchasHorariasPage from "./pages/ManchasHorariasPage";
import UnidadesCurricularesPage from "./pages/UnidadesCurricularesPage";
import Navbar from "./components/Navbar";
import CriarUC from "./pages/CriarUC";
import DetalheUC from "./pages/DetalheUC";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ROUTES = {
  LOG_IN: "/login",
  REGISTER: "/register",
  HOME: "/home",
  SCHEDULE: "/schedule",
  DOCENTES: "/docentes",
  ESCOLAS: "/escolas", 
  SALAS: "/salas",
  CURSOS: "/cursos",
  MANCHAS_HORARIAS: "/manchas_horarias",
  UNIDADES_CURRICULARES: "/unidades_curriculares",
  CRIAR_UC: "/criar-uc",
  DETALHE_UC: "/unidades_curriculares/detalhes/:id",
};

const App = () => (
  <HashRouter>
    <Navbar/>

    <ToastContainer closeButton={false}/>

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route key={ROUTES.HOME} path={ROUTES.HOME} element={<HomePage />} />
      <Route key={ROUTES.LOG_IN} path={ROUTES.LOG_IN} element={<LogInPage />} />
      <Route
        key={ROUTES.REGISTER}
        path={ROUTES.REGISTER}
        element={<RegisterPage />}
      />
      <Route
        key={ROUTES.SCHEDULE}
        path={ROUTES.SCHEDULE}
        element={<SchedulePage />}
      />
      <Route key={ROUTES.DOCENTES} path={ROUTES.DOCENTES} element={<DocentesPage />} />
      <Route key={ROUTES.ESCOLAS} path={ROUTES.ESCOLAS} element={<EscolasPage />} />
      <Route key={ROUTES.SALAS} path={ROUTES.SALAS} element={<SalasPage />} />
      <Route key={ROUTES.CURSOS} path={ROUTES.CURSOS} element={<CursosPage />} />
      <Route key={ROUTES.MANCHAS_HORARIAS} path={ROUTES.MANCHAS_HORARIAS} element={<ManchasHorariasPage />} />
      <Route key={ROUTES.UNIDADES_CURRICULARES} path={ROUTES.UNIDADES_CURRICULARES} element={<UnidadesCurricularesPage />} />
      <Route key={ROUTES.CRIAR_UC} path={ROUTES.CRIAR_UC} element={<CriarUC />} />
      <Route key={ROUTES.DETALHE_UC} path={ROUTES.DETALHE_UC} element={<DetalheUC />} /> {/* Rota para os detalhes da UC */}
    </Routes>
  </HashRouter>
);

export default App;
