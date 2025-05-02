import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { register } from "../api/api";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [escola, setEscola] = useState("");
  const [curso, setCurso] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!nome || !escola || !curso || !password || !password2) {
      alert("Preencha todos os campos");
      return;
    }

    if (password != password2) {
      alert("As palavras-passe não coincidem");
      return;
    }

    register(nome, escola, curso, password, password2)
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'Erro ao tentar registar');
      });
  }

 

  return (
    <>
      <div class="container">
        <div class="row justify-content-center mt-5">
          <div class="col-md-4 border p-5 rounded-3 bg-light shadow">
            <img
              src="https://portal2.ipt.pt/media/manager.php?src=servico&cmd=file&target=m1_MTc1ODE"
              className="img-fluid d-block mx-auto mb-2 w-75"
              alt="logo"
            ></img>
            <h2 class="mb-4">Registo</h2>
            <form onSubmit={handleSubmit}>

            <div class="mb-3">
                <label for="nome" class="form-label">Nome: </label>
                <input
                  type="email"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  class="form-control"
                  placeholder="Insira o seu nome de utilizador"
                />
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Escola: </label>
                <input
                  type="escola"
                  value={escola}
                  onChange={(e) => setEscola(e.target.value)}
                  class="form-control"
                  placeholder="Insira o acrónimo da escola"
                />
              </div>

              <div class="mb-3">
                <label for="curso" class="form-label">Curso: </label>
                <input
                  type="email"
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  class="form-control"
                  placeholder="Insira o curso"
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Palavra-passe: </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="form-control"
                  placeholder="Insira a palavra-passe"
                />
              </div>

              <div class="mb-3">
                <label for="password2" class="form-label">Confirmação de palavra-passe: </label>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  class="form-control"
                  placeholder="Repita a palavra-passe"
                />
              </div>

              <button type="submit" class="btn btn-success w-25 d-block mx-auto">Criar Conta</button>
              <Link to="/login" class="d-block text-center mt-3 text-decoration-none text-dark">Iniciar Sessão</Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
