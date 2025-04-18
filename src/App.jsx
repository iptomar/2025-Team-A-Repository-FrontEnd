import React from "react";
import { HashRouter, Route, Routes, useLocation  } from "react-router-dom";
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
import TurmasPage from "./pages/TurmasPage";
import Navbar from "./components/Navbar";
import CriarUC from "./pages/CriarUC";
import DetalheUC from "./pages/DetalheUC";
import EditarUC from "./pages/EditarUC";
import DetalhesTurma from "./pages/DetalhesPage/DetalhesTurma";
import CriarTurma from "./pages/CriarPage/CriarTurma"
import EditarTurma from "./pages/EditarPage/EditarTurma";
import DetalhesEscola from "./pages/DetalhesPage/DetalhesEscola";
import CriarEscola from "./pages/CriarPage/CriarEscola";
import EditarEscola from "./pages/EditarPage/EditarEscola";
import CriarCurso from "./pages/CriarPage/CriarCurso";
import DetalhesCurso from "./pages/DetalhesPage/DetalhesCurso";
import EditarCurso from "./pages/EditarPage/EditarCurso";

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
  TURMAS: "/turmas",
  CRIAR_UC: "/criar-uc",
  DETALHE_UC: "/unidades_curriculares/detalhes/:id",
  EDITAR_UC: "/unidades_curriculares/editar/:id",
  DETALHES_TURMA: "/turmas/detalhes/:id",
  CRIAR_TURMA: "/criar-turma",
  EDITAR_TURMA: "/turmas/editar/:id",
  DETALHES_ESCOLA: "/escolas/detalhes/:id",
  CRIAR_ESCOLA: "/criar-escola",
  EDITAR_ESCOLA: "/escolas/editar/:id",
  CRIAR_CURSO: "/criar-curso",
  DETALHES_CURSO: "/cursos/detalhes/:id",
  EDITAR_CURSO: "/cursos/editar/:id",
};

// const App = () => (
//   <HashRouter>
//     <Navbar/>

//     <ToastContainer closeButton={false}/>

//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route key={ROUTES.HOME} path={ROUTES.HOME} element={<HomePage />} />
//       <Route key={ROUTES.LOG_IN} path={ROUTES.LOG_IN} element={<LogInPage />} />
//       <Route
//         key={ROUTES.REGISTER}
//         path={ROUTES.REGISTER}
//         element={<RegisterPage />}
//       />
//       <Route
//         key={ROUTES.SCHEDULE}
//         path={ROUTES.SCHEDULE}
//         element={<SchedulePage />}
//       />
//       <Route key={ROUTES.DOCENTES} path={ROUTES.DOCENTES} element={<DocentesPage />} />
//       <Route key={ROUTES.ESCOLAS} path={ROUTES.ESCOLAS} element={<EscolasPage />} />
//       <Route key={ROUTES.SALAS} path={ROUTES.SALAS} element={<SalasPage />} />
//       <Route key={ROUTES.CURSOS} path={ROUTES.CURSOS} element={<CursosPage />} />
//       <Route key={ROUTES.MANCHAS_HORARIAS} path={ROUTES.MANCHAS_HORARIAS} element={<ManchasHorariasPage />} />
//       <Route key={ROUTES.UNIDADES_CURRICULARES} path={ROUTES.UNIDADES_CURRICULARES} element={<UnidadesCurricularesPage />} />
//       <Route key={ROUTES.CRIAR_UC} path={ROUTES.CRIAR_UC} element={<CriarUC />} />
//       <Route key={ROUTES.EDITAR_UC} path={ROUTES.EDITAR_UC} element={<EditarUC />} /> 
//       <Route key={ROUTES.DETALHE_UC} path={ROUTES.DETALHE_UC} element={<DetalheUC />} /> {/* Rota para os detalhes da UC */}
//       <Route key={ROUTES.TURMAS} path={ROUTES.TURMAS} element={<TurmasPage />} />
//       <Route key={ROUTES.DETALHES_TURMA} path={ROUTES.DETALHES_TURMA} element={<DetalhesTurma />} />
//       <Route key={ROUTES.CRIAR_TURMA} path={ROUTES.CRIAR_TURMA} element={<CriarTurma />} />
//       <Route key={ROUTES.EDITAR_TURMA} path={ROUTES.EDITAR_TURMA} element={<EditarTurma />} />
//       <Route key={ROUTES.DETALHES_ESCOLA} path={ROUTES.DETALHES_ESCOLA} element={<DetalhesEscola />} />
//       <Route key={ROUTES.CRIAR_ESCOLA} path={ROUTES.CRIAR_ESCOLA} element={<CriarEscola />} />
//       <Route key={ROUTES.EDITAR_ESCOLA} path={ROUTES.EDITAR_ESCOLA} element={<EditarEscola />} />
//     </Routes>
//   </HashRouter>
// );
const AppRoutes = () => {
  const location = useLocation();
  console.log("Current path:", location.pathname);
  const isAuthPage = location.pathname === "/" || location.pathname === ROUTES.LOG_IN || location.pathname === ROUTES.REGISTER;

  return (
    <>
      {!isAuthPage && <Navbar />}
      <ToastContainer closeButton={false} />

      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path={ROUTES.LOG_IN} element={<LogInPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SCHEDULE} element={<SchedulePage />} />
        <Route path={ROUTES.DOCENTES} element={<DocentesPage />} />
        <Route path={ROUTES.ESCOLAS} element={<EscolasPage />} />
        <Route path={ROUTES.SALAS} element={<SalasPage />} />
        <Route path={ROUTES.CURSOS} element={<CursosPage />} />
        <Route path={ROUTES.MANCHAS_HORARIAS} element={<ManchasHorariasPage />} />
        <Route path={ROUTES.UNIDADES_CURRICULARES} element={<UnidadesCurricularesPage />} />
        <Route path={ROUTES.CRIAR_UC} element={<CriarUC />} />
        <Route path={ROUTES.EDITAR_UC} element={<EditarUC />} />
        <Route path={ROUTES.DETALHE_UC} element={<DetalheUC />} />
        <Route path={ROUTES.TURMAS} element={<TurmasPage />} />
        <Route path={ROUTES.DETALHES_TURMA} element={<DetalhesTurma />} />
        <Route path={ROUTES.CRIAR_TURMA} element={<CriarTurma />} />
        <Route path={ROUTES.EDITAR_TURMA} element={<EditarTurma />} />
        <Route path={ROUTES.DETALHES_ESCOLA} element={<DetalhesEscola />} />
        <Route path={ROUTES.CRIAR_ESCOLA} element={<CriarEscola />} />
        <Route path={ROUTES.EDITAR_ESCOLA} element={<EditarEscola />} />
        <Route path={ROUTES.CRIAR_CURSO} element={<CriarCurso />} />
        <Route path={ROUTES.DETALHES_CURSO} element={<DetalhesCurso />} />
        <Route path={ROUTES.EDITAR_CURSO} element={<EditarCurso />} />
      </Routes>
    </>
  );
};

const App = () => (
  <HashRouter>
    <AppRoutes />
  </HashRouter>
);
export default App;
