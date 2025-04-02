import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div>
            <h2>Home</h2>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/horario">Horarios</Link>
        </div>
    )
}