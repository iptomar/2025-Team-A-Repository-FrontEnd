import { Link } from "react-router-dom";
import '../css/home.css'; 

export default function HomePage() {
    return (
        <div className="home-container">
            <div className="home-card">
                <h1 className="home-title">Olá, bem-vindo!</h1>
                <p className="home-text">
                    Esta plataforma foi criada para facilitar a gestão e visualização de horários escolares.
                    É possível consultar turmas, docentes, salas, unidades curriculares e muito mais.
                </p>
                <Link to="/schedule" className="home-button">
                    Ver Horários
                </Link>
            </div>
        </div>
    );
}
