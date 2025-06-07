import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/navbar.css';
import { ROUTES } from '../Routes';
import logo from "../assets/ipt_logo.svg";
import { FaMoon, FaSun } from 'react-icons/fa';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('modo-escuro') === 'true');

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("modo-escuro", darkMode);
  }, [darkMode]);

  const navigate = useNavigate();
  const { setUser, user } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenType");
    
    // Limpa o user
  setUser(null);

  // Força modo claro manualmente
  setDarkMode(false);
  document.body.classList.remove("dark-mode");
  localStorage.setItem("modo-escuro", "false");

  // Vai para login
  navigate(ROUTES.LOG_IN);
  };

  // Função para verificar se o user tem pelo menos uma das roles necessárias
  const hasRole = (requiredRoles = []) => {
    if (!user || !user.role) return false;
    if (requiredRoles.length === 0) return user.role.length > 0;
    return requiredRoles.some(role => user.role.includes(role));
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light custom-navbar">
      <div className="container-fluid">
        <div onClick={() => navigate(ROUTES.HOME)} style={{ cursor: 'pointer' }}>
          <img
            src={logo}
            alt="Logo"
            width="200px"
            height="60px"
            className="d-inline-block align-text-top logo"
            style={{ margin: '5px' }}
          />
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target=".navbar-collapse"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between" style={{ marginLeft: '20px' }}>
          <ul className="navbar-nav flex-grow-1 align-items-center">

            {/* Horários visível sempre para utilizadores com qualquer role */}
            {hasRole() && (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate(ROUTES.SCHEDULE)}>
                  <strong>Horários</strong>
                </button>
              </li>
            )}

            {/* Dropdown Gestão - Só mostra estas rotas se o utilizador tiver alguma role*/}
            {hasRole() && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  id="gestaoDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  type="button"
                >
                  <strong>Gestão</strong>
                </button>
                <ul className="dropdown-menu" aria-labelledby="gestaoDropdown">
                  <li>
                    <button className="dropdown-item" onClick={() => navigate(ROUTES.DOCENTES)}>
                      Docentes
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate(ROUTES.ESCOLAS)}>
                      Escolas
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate(ROUTES.UNIDADES_CURRICULARES)}>
                      Unidades Curriculares
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate(ROUTES.SALAS)}>
                      Salas
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate(ROUTES.CURSOS)}>
                      Cursos
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate(ROUTES.TURMAS)}>
                      Turmas
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate(ROUTES.MANCHAS_HORARIAS)}>
                      Manchas Horárias
                    </button>
                  </li>
                </ul>
              </li>
            )}

            {/* Apenas para Administrador */}
            {hasRole(["Administrador"]) && (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate(ROUTES.UTILIZADORES)}>
                  <strong>Utilizadores</strong>
                </button>
              </li>
            )}

          </ul>

          <ul className="navbar-nav align-items-center">

            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => setDarkMode(prev => !prev)}
                title="Alternar modo escuro"
                type="button"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </li>

            {user ? (
              <>
                <li className="nav-item nav-link">
                  Olá, <strong>{user.name}</strong>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout} type="button">
                    <strong>Logout</strong>
                  </button>
                </li>
              </>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => {navigate(ROUTES.IMPORTAR)}}><strong>Importar Dados</strong></button>
                            </li>
                        </ul>
            ) : (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate(ROUTES.LOG_IN)} type="button">
                  <strong>Login</strong>
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
