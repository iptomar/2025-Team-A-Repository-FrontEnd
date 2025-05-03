import React from 'react'; 
import { Route, useNavigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/navbar.css';
import { ROUTES } from '../Routes';
import logo from "../assets/logoIPT.png";

const Navbar = () => {
    const navigate = useNavigate()
    return (
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light custom-navbar">
            <div className="container-fluid">
            <img src={logo} alt="Logo" width={'200px'} height={'60px'} className="d-inline-block align-text-top" style={{margin:'5px'}}/>
                {/* <button className="nav-link btn btn-link" onClick={() => {}}><span id="title">Projeto</span></button> */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between" style={{marginLeft:'20px'}}>
                    <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.HOME)}}><strong>Home</strong></button>

                            </li> 
                       
                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.SCHEDULE)}}><strong>Horários</strong></button>

                            </li> 
                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.DOCENTES)}}><strong>Docentes</strong></button>

                            </li> 
                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.ESCOLAS)}}><strong>Escolas</strong></button>

                            </li> 
                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.UNIDADES_CURRICULARES)}}><strong>Unidades Curriculares</strong></button>

                            </li> 
                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.SALAS)}}><strong>Salas</strong></button>

                            </li> 
                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.CURSOS)}}><strong>Cursos</strong></button>

                            </li> 

                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.TURMAS)}}><strong>Turmas</strong></button>

                            </li>

                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.MANCHAS_HORARIAS)}}><strong>Manchas Horárias</strong></button>

                            </li> 
                            <li className="nav-item">
                                <button className="nav-link btn btn-link " onClick={() => {navigate(ROUTES.UTILIZADORES)}}><strong>Utilizadores</strong></button>

                            </li> 


                    </ul>

                        {/* <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => {navigate(ROUTES.REGISTER)}}><strong>Criar Conta</strong></button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => {navigate(ROUTES.LOG_IN)}}><strong>Iniciar Sessão</strong></button>

                            </li>
                        </ul> */}
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => {navigate(ROUTES.LOG_IN)}}><strong>Logout</strong></button>
                            </li>
                        </ul>
                </div>
            </div>
        </nav>

    );
}

export default Navbar;