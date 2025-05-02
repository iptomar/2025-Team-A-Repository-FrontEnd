import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const [nome, setNome] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()

        if ( !nome || !password ) {
            alert('Preencha todos os campos')
            return
        }

        login(nome, password)
            .then(res => {
                console.log(res);
                navigate('/home');
            })
            .catch(err => {
                console.error(err);
                alert(err.message || 'Erro ao tentar iniciar sessão');
            });
    }

    return (
        <>
            <div class="container">        
                <div class="row justify-content-center mt-5"> 
                    <div class="col-md-4 border p-5 rounded-3 bg-light shadow">
                        <img src='https://portal2.ipt.pt/media/manager.php?src=servico&cmd=file&target=m1_MTc1ODE' 
                        className="img-fluid d-block mx-auto mb-2 w-75"
                        alt="logo"></img>
                        <h2 class="mb-4">Iniciar Sessão</h2>
                        <form onSubmit={handleSubmit}>
                            <div class="mb-3">
                                <label for="nome" class="form-label">Nome:</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    class="form-control"
                                    placeholder="Insira o seu nome de utilizador"
                                    required
                                />
                            </div>

                            <div class="mb-3">
                                <label for="password" class="form-label">Palavra-passe:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    class="form-control"
                                    placeholder="Insira a palavra-passe"
                                />
                            </div>
                            <button type="submit" class="btn btn-success w-25 d-block mx-auto">Entrar</button>
                            <Link to="/register" class="d-block text-center mt-3 text-decoration-none text-dark">Criar Conta</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
