import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()

        if ( !email || !password ) {
            alert('Preencha todos os campos')
            return
        }

        axios.post('http://localhost:5269/api/utilizadores/sign-in-user', {
            email: email,
            password: password
        })
        .then(res => {
            console.log(res)
            navigate('/')
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao tentar fazer login')
        })
    }

    return (
        <>
            <div class="container">        
                <div class="row justify-content-center mt-5"> 
                    <div class="col-md-4 border p-5 rounded-3 bg-light shadow">
                        <img src='https://portal2.ipt.pt/media/manager.php?src=servico&cmd=file&target=m1_MTc1ODE' 
                        className="img-fluid d-block mx-auto mb-2 w-75"
                        alt="logo"></img>
                        <h2 class="mb-4">Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    class="form-control"
                                    placeholder="Enter email"
                                />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    class="form-control"
                                    placeholder="Enter password"
                                />
                            </div>
                            <button type="submit" class="btn btn-primary w-25 d-block mx-auto">Login</button>
                            <Link to="/" class="d-block text-center mt-3 text-decoration-none text-dark">Criar Conta</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
