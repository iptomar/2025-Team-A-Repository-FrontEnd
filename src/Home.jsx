import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h2>Home</h2>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
        </div>
    )
}