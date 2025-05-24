import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/api';
import { UserContext } from '../UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const { setUser, fetchMe } = useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();

        if ( !email || !password ) {
            alert('Preencha todos os campos');
            return;
        }

        try {
            await login(email, password);

            // Agora vamos buscar os dados do utilizador autenticado
            const userData = await fetchMe();

            if (userData) {
                setUser(userData);
                navigate('/home');
            } else {
                alert("Erro ao obter dados do utilizador");
            }
        } catch (err) {
            alert(err.message || 'Erro ao tentar iniciar sessão');
        }
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-4 border p-5 rounded-3 bg-light shadow">
                        <img src='https://portal2.ipt.pt/media/manager.php?src=servico&cmd=file&target=m1_MTc1ODE'
                            className="img-fluid d-block mx-auto mb-2 w-75"
                            alt="logo"></img>
                        <h2 className="mb-4">Iniciar Sessão</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label> {/* Mudança de 'nome' para 'email' */}
                                <input
                                    type="email"
                                    value={email}  // Mudança de 'nome' para 'email'
                                    onChange={(e) => setEmail(e.target.value)}  // Mudança de 'nome' para 'email'
                                    className="form-control"
                                    placeholder="Insira o seu email"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Palavra-passe:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                    placeholder="Insira a palavra-passe"
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-25 d-block mx-auto">Entrar</button>
                            <Link to="/register" className="d-block text-center mt-3 text-decoration-none text-dark">Criar Conta</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
