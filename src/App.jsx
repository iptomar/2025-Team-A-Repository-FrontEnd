import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import LogInPage from "./pages/LogInPage";
import SchedulePage from "./pages/SchedulePage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

export const ROUTES = {
  LOG_IN: "/login",
  REGISTER: "/register",
  HOME: "/home",
  HORARIO: "/horario",
};

const App = () => (
  <HashRouter>
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
        key={ROUTES.HORARIO}
        path={ROUTES.HORARIO}
        element={<SchedulePage />}
      />
    </Routes>
  </HashRouter>
);

export default App;
