import React, { useContext, useEffect } from "react";
import { HashRouter, Route, Routes, useLocation, useNavigate, Navigate } from "react-router-dom";

import LogInPage from "./pages/LogInPage";
import HorariosPage from "./pages/HorariosPage";
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
import CriarTurma from "./pages/CriarPage/CriarTurma";
import EditarTurma from "./pages/EditarPage/EditarTurma";
import DetalhesEscola from "./pages/DetalhesPage/DetalhesEscola";
import CriarEscola from "./pages/CriarPage/CriarEscola";
import EditarEscola from "./pages/EditarPage/EditarEscola";
import CriarCurso from "./pages/CriarPage/CriarCurso";
import DetalhesCurso from "./pages/DetalhesPage/DetalhesCurso";
import EditarCurso from "./pages/EditarPage/EditarCurso";
import CriarManchaHoraria from "./pages/CriarPage/CriarManchaHoraria";
import EditarManchaHoraria from "./pages/EditarPage/EditarManchaHoraria";
import DetalhesManchaHoraria from "./pages/DetalhesPage/DetalhesManchaHoraria";
import CriarDocente from "./pages/CriarPage/CriarDocente";
import EditarDocente from "./pages/EditarPage/EditarDocente";
import DetalhesDocente from "./pages/DetalhesPage/DetalhesDocente";
import EditarUtilizador from "./pages/EditarPage/EditarUtilizador";
import DetalhesUtilizador from "./pages/DetalhesPage/DetalhesUtilizador";
import UtilizadoresPage from "./pages/UtilizadoresPage";
import CriarSala from "./pages/CriarPage/CriarSala";
import EditarSala from "./pages/EditarPage/EditarSala";
import DetalhesSala from "./pages/DetalhesPage/DetalhesSala";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ROUTES } from "./Routes";

import { UserContext } from "./UserContext"; // importa o contexto do utilizador

const AppContent = () => {
  // const { user } = useContext(UserContext);

  // const location = useLocation();
  // const navigate = useNavigate();
  // const pathname = location.pathname;

  // const isAuthenticated = () => !!localStorage.getItem("token");

  // const publicRoutes = [ROUTES.LOG_IN, ROUTES.REGISTER];
  // const showNavbar = !publicRoutes.includes(pathname);

  // useEffect(() => {
  //   // Se NÃO estiver autenticado e tentar rota privada
  //   if (!isAuthenticated() && !publicRoutes.includes(pathname)) {
  //     navigate(ROUTES.LOG_IN);
  //   }
  //   if (isAuthenticated() && publicRoutes.includes(pathname)) {      
  //     navigate(ROUTES.HOME);
  //   }
  // }, [pathname, isAuthenticated, navigate]);

  // // Função para checar se o user tem pelo menos uma das roles necessárias
  // const hasRole = (requiredRoles = []) => {
  //   if (!user || !user.role) {
  //     return false;
  //   }
  //   if (requiredRoles.length === 0) {
  //     return user.role.length > 0;
  //   }
  //   const hasRequired = requiredRoles.some((role) => user.role.includes(role));
  //   return hasRequired;
  // };

  // if (!isAuthenticated()) {
  //   // Se não autenticado, só permite rotas públicas
  //   return (
  //     <>
  //       <Routes>
  //         <Route path={ROUTES.LOG_IN} element={<LogInPage />} />
  //         <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
  //         <Route path="*" element={<Navigate to={ROUTES.LOG_IN} replace />} />
  //       </Routes>
  //     </>
  //   );
  // }

  return (
    <>
      {/* {showNavbar &&  */}
      <Navbar />
       {/* } */}
      <ToastContainer closeButton={false} />
      <Routes>
        {/* Rotas acessíveis a qualquer user autenticado com role
        <Route path="/" element={<HomePage />} />
        <Route key={ROUTES.HOME} path={ROUTES.HOME} element={<HomePage />} />

        {hasRole() && (
          <> */}
            <Route key={ROUTES.SCHEDULE} path={ROUTES.SCHEDULE} element={<HorariosPage />} />
            <Route key={ROUTES.DOCENTES} path={ROUTES.DOCENTES} element={<DocentesPage />} />
            <Route key={ROUTES.ESCOLAS} path={ROUTES.ESCOLAS} element={<EscolasPage />} />
            <Route key={ROUTES.SALAS} path={ROUTES.SALAS} element={<SalasPage />} />
            <Route key={ROUTES.CURSOS} path={ROUTES.CURSOS} element={<CursosPage />} />
            <Route key={ROUTES.MANCHAS_HORARIAS} path={ROUTES.MANCHAS_HORARIAS} element={<ManchasHorariasPage />} />
            <Route key={ROUTES.UNIDADES_CURRICULARES} path={ROUTES.UNIDADES_CURRICULARES} element={<UnidadesCurricularesPage />} />
            <Route key={ROUTES.CRIAR_UC} path={ROUTES.CRIAR_UC} element={<CriarUC />} />
            <Route key={ROUTES.EDITAR_UC} path={ROUTES.EDITAR_UC} element={<EditarUC />} />
            <Route key={ROUTES.DETALHE_UC} path={ROUTES.DETALHE_UC} element={<DetalheUC />} />
            <Route key={ROUTES.TURMAS} path={ROUTES.TURMAS} element={<TurmasPage />} />
            <Route key={ROUTES.DETALHES_TURMA} path={ROUTES.DETALHES_TURMA} element={<DetalhesTurma />} />
            <Route key={ROUTES.CRIAR_TURMA} path={ROUTES.CRIAR_TURMA} element={<CriarTurma />} />
            <Route key={ROUTES.EDITAR_TURMA} path={ROUTES.EDITAR_TURMA} element={<EditarTurma />} />
            <Route key={ROUTES.DETALHES_ESCOLA} path={ROUTES.DETALHES_ESCOLA} element={<DetalhesEscola />} />
            <Route key={ROUTES.CRIAR_ESCOLA} path={ROUTES.CRIAR_ESCOLA} element={<CriarEscola />} />
            <Route key={ROUTES.EDITAR_ESCOLA} path={ROUTES.EDITAR_ESCOLA} element={<EditarEscola />} />
            <Route key={ROUTES.DETALHES_MANCHAHORARIA} path={ROUTES.DETALHES_MANCHAHORARIA} element={<DetalhesManchaHoraria />} />
            <Route key={ROUTES.CRIAR_MANCHAHORARIA} path={ROUTES.CRIAR_MANCHAHORARIA} element={<CriarManchaHoraria />} />
            <Route key={ROUTES.EDITAR_MANCHAHORARIA} path={ROUTES.EDITAR_MANCHAHORARIA} element={<EditarManchaHoraria />} />
            <Route path={ROUTES.CRIAR_CURSO} element={<CriarCurso />} />
            <Route path={ROUTES.DETALHES_CURSO} element={<DetalhesCurso />} />
            <Route path={ROUTES.EDITAR_CURSO} element={<EditarCurso />} />
            <Route path={ROUTES.CRIAR_DOCENTE} element={<CriarDocente />} />
            <Route path={ROUTES.DETALHES_DOCENTE} element={<DetalhesDocente />} />
            <Route path={ROUTES.EDITAR_DOCENTE} element={<EditarDocente />} />
            <Route path={ROUTES.CRIAR_SALA} element={<CriarSala />} />
            <Route path={ROUTES.EDITAR_SALA} element={<EditarSala />} />
            <Route path={ROUTES.DETALHES_SALA} element={<DetalhesSala />} />
          {/* </>
        )} */}

        {/* Rotas apenas para Administrador */}
        {/* {hasRole(["Administrador"]) && (
          <>
            <Route path={ROUTES.UTILIZADORES} element={<UtilizadoresPage />} />
            <Route path={ROUTES.EDITAR_UTILIZADOR} element={<EditarUtilizador />} />
            <Route path={ROUTES.DETALHES_UTILIZADOR} element={<DetalhesUtilizador />} />
          </>
        )} */}

        {/* Caso user não tenha acesso a alguma rota (catch-all) */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </>
  );
};


const App = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;