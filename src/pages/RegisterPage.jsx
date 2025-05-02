import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import * as Api from "../api/api";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { register } from "../api/api";

export default function RegisterPage() {
  const [listaEscolas, setListaEscolas] = useState([]);
  const [rawEscolas, setRawEscolas] = useState([]);
  const [escolaSelecionada, setEscolaSelecionada] = useState(null);

  const [listaCursos, setListaCursos] = useState([]);
  const [rawCursos, setRawCursos] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([Api.getEscola(), Api.getCursos()])
      .then(async ([resEscola, resCurso]) => {
        const dataEscola = await resEscola.json();
        const dataCurso = await resCurso.json();
  
        setRawEscolas(dataEscola);
        setListaEscolas(dataEscola.map(e => ({ value: e.id, label: e.nome })));

        setRawCursos(dataCurso);
        setListaCursos(dataCurso.map(c => ({ value: c.codCurso, label: c.nome })));
      })
      .catch(() => toast.error("Erro ao carregar escolas ou cursos"));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
  
    const escolaFK = rawEscolas.find(e => e.id === escolaSelecionada?.value);
    const cursoFK = rawCursos.find(c => c.codCurso === cursoSelecionado?.value);
  
    if (!nome || !email || !escolaFK || !cursoFK || !password || !password2) {
      toast.error("Preencha todos os campos");
      return;
    }
  
    if (password !== password2) {
      toast.error("As palavras-passe não coincidem");
      return;
    }

    console.log(nome +";"+ email +";"+ escolaFK.id +";"+ cursoFK.codCurso +";"+ password)
  
    register(nome, email, escolaFK.id, cursoFK.codCurso, password)
      .then(() => {
        toast.success("Conta criada com sucesso!");
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message || 'Erro ao tentar registar');
      });
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4 border p-5 rounded-3 bg-light shadow">
          <img
            src="https://portal2.ipt.pt/media/manager.php?src=servico&cmd=file&target=m1_MTc1ODE"
            className="img-fluid d-block mx-auto mb-2 w-75"
            alt="logo"
          />
          <h2 className="mb-4 text-center">Registo</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome:</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="form-control"
                placeholder="Insira o seu nome de utilizador"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Insira o seu email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="escolaFK" className="form-label">Escola</label>
              <Select
                id="escolaFK"
                options={listaEscolas}
                value={escolaSelecionada}
                onChange={setEscolaSelecionada}
                placeholder="Selecione a escola"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cursoFK" className="form-label">Curso</label>
              <Select
                id="cursoFK"
                options={listaCursos}
                value={cursoSelecionado}
                onChange={setCursoSelecionado}
                placeholder="Selecione o curso"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Palavra-passe:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Insira a palavra-passe"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password2" className="form-label">Confirmação de palavra-passe:</label>
              <input
                type="password"
                id="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="form-control"
                placeholder="Repita a palavra-passe"
              />
            </div>

            <button type="submit" className="btn btn-success w-100">Criar Conta</button>
            <Link to="/login" className="d-block text-center mt-3 text-decoration-none text-dark">
              Iniciar Sessão
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
