import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import CriarPage from "./CriarPage";
import ReturnButton from "../../components/common/ReturnButton";
import SubmitButton from "../../components/common/SubmitButton";
import customDarkStyles from "../../components/DarkModeFiles/darkmode"; // Importa o estilo personalizado para o modo escuro
import useDarkMode from "../../components/DarkModeFiles/useDarkMode"; // Hook personalizado para verificar o modo escuro

export default function CriarCurso() {
  const [nome, setNome] = useState("");
  const [escolaSelecionada, setEscolaSelecionada] = useState(null);
  const [listaEscolas, setListaEscolas] = useState([]);
  const [rawEscolas, setRawEscolas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isDarkMode = useDarkMode(); // Verifica se o modo escuro está ativo

  useEffect(() => {
    // Carrega escolas
    Api.getEscola()
      .then(res => res.json())
      .then(data => {
        setRawEscolas(data);
        const escolas = data.map(e => ({ value: e.id, label: e.nome }));
        setListaEscolas(escolas);
      })
      .catch(() => toast.error("Erro ao carregar escolas"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome || !escolaSelecionada) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const escolaFK = rawEscolas.find(e => e.id === escolaSelecionada.value);

    const novoCurso = {
      nome,
      escola : escolaFK,
    };

    console.log("Curso a criar:", novoCurso);

    setLoading(true);
    Api.criarCurso(novoCurso)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.erro) {
          toast.error(data.erro);
        } else {
          toast.success("Curso criado com sucesso!");
          navigate("/cursos");
        }
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
        toast.error("Erro ao criar curso.");
      });
  };

  return (
    <CriarPage titulo="Criar Curso">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome do Curso</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Escola</label>
          <Select
            options={listaEscolas}
            value={escolaSelecionada}
            onChange={(selected) => setEscolaSelecionada(selected)}
            required
            styles={isDarkMode ? customDarkStyles : {}} // Aplica estilos personalizados
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Criar" />
          <ReturnButton text="Voltar" endpoint="/cursos" />
        </div>
      </form>
    </CriarPage>
  );
}
