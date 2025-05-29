import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import CursoSelect from "../../components/common/SelectCurso";
import CriarPage from "./CriarPage";
import ReturnButton from "../../components/common/ReturnButton";
import { Select, MenuItem } from "@mui/material";
import customDarkStyles from "../../components/DarkModeFiles/darkmode"; // Importa o estilo personalizado para o modo escuro
import useDarkMode from "../../components/DarkModeFiles/useDarkMode"; // Hook personalizado para verificar o modo escuro

export default function CriarTurma() {
  const [nome, setNome] = useState("");
  const [anoCurso, setanoCurso] = useState("");
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isDarkMode = useDarkMode(); // Verifica se o modo escuro está ativo
  
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!nome || !anoCurso || !curso) {
      toast.error("Por favor, preencha todos os campos e selecione um curso.");
      return;
    }

    // Dados a serem enviados no formato esperado pela API
    const dataASubmeter = {
      nome: nome,
      anoCurso: anoCurso,
      cursoFK: curso.value,
    };

    console.log("Dados a enviar para a API:", dataASubmeter);

    setLoading(true);

    Api.criarTurma(dataASubmeter)
      .then((response) => {
        console.log("Resposta da API:", response);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.erro) {
          toast.error(data.erro);
        } else {
          toast.success("Turma criada com sucesso!");
          navigate("/turmas");
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao criar a turma.");
        console.error(error);
      });
  };

  return (
    <CriarPage titulo="Criar Turma">
      <form onSubmit={handleSubmit}>
        <TextInput
          id="nome"
          label="Nome da Turma"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <label className="form-label">Selecione o Ano do Curso</label>
        <br></br>
        <Select
          style={{ width: "100%", height: "40px", marginBottom: "15px" }}
          labelId="anoCurso-label"
          id="anoCurso"
          value={anoCurso}
          onChange={(e) => setanoCurso(e.target.value)}
        >
          <MenuItem value="1º Ano">1º Ano</MenuItem>
          <MenuItem value="2º Ano">2º Ano</MenuItem>
          <MenuItem value="3º Ano">3º Ano</MenuItem>
        </Select>
        <CursoSelect
          id="curso"
          label="Curso"
          value={curso}
          onChange={setCurso}
          styles={isDarkMode ? customDarkStyles : {}} // Aplica estilos personalizados
        />
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Criar" />
          <ReturnButton text="Voltar" endpoint="/turmas" />
        </div>
      </form>
    </CriarPage>
  );
}
