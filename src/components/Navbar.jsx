import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/navbar.css';
import { ROUTES } from '../Routes';
import logo from "../assets/logoIPT.png";
import { FaMoon, FaSun } from 'react-icons/fa';
import { useEffect,  useState} from 'react';
import { useContext } from 'react';
import { UserContext } from '../UserContext';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('modo-escuro') === 'true';
    });

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("modo-escuro", darkMode);
    }, [darkMode]);
  
  const navigate = useNavigate();
  const { setUser, user } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenType");
    setUser(null);
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
        <img src={logo} alt="Logo" width={'200px'} height={'60px'} className="d-inline-block align-text-top" style={{ margin: '5px' }} />
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between" style={{ marginLeft: '20px' }}>
          <ul className="navbar-nav flex-grow-1">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.HOME) }}><strong>Home</strong></button>
            </li>

            {/* Só mostra estas rotas se o utilizador tiver alguma role */}
            {hasRole() && (
              <>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.SCHEDULE) }}><strong>Horários</strong></button>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.DOCENTES) }}><strong>Docentes</strong></button>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.ESCOLAS) }}><strong>Escolas</strong></button>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.UNIDADES_CURRICULARES) }}><strong>Unidades Curriculares</strong></button>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.SALAS) }}><strong>Salas</strong></button>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.CURSOS) }}><strong>Cursos</strong></button>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.TURMAS) }}><strong>Turmas</strong></button>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.MANCHAS_HORARIAS) }}><strong>Manchas Horárias</strong></button>
                </li>
              </>
            )}

            {/* Apenas para Administrador */}
            {hasRole(["Administrador"]) && (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => { navigate(ROUTES.UTILIZADORES) }}><strong>Utilizadores</strong></button>
              </li>
            )}

          </ul>

          <ul className="navbar-nav">
            <li className="nav-item">
                <button
                    className="nav-link btn btn-link"
                    onClick={() => setDarkMode(prev => !prev)}
                    title="Alternar modo escuro"
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
                  <button className="nav-link btn btn-link" onClick={handleLogout}><strong>Logout</strong></button>
                </li>
              </>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => {navigate(ROUTES.IMPORTAR)}}><strong>Importar Dados</strong></button>
                            </li>
                        </ul>
            ) : (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate(ROUTES.LOG_IN)}><strong>Login</strong></button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
