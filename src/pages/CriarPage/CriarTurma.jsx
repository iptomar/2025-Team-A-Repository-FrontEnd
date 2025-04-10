import React, { useState} from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate } from 'react-router-dom';
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import CursoSelect from "../../components/common/SelectCurso";
import CriarPage from "./CriarPage";
import ReturnButton from "../../components/common/ReturnButton";

export default function CriarTurma() {
  const [nome, setNome] = useState("");
  const [anoLetivo, setAnoLetivo] = useState("");
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!nome || !anoLetivo || !curso) {
      toast.error("Por favor, preencha todos os campos e selecione um curso.");
      return;
    }
  
    // Dados a serem enviados no formato esperado pela API
    const dataASubmeter = {
      nome: nome,
      anoLetivo: anoLetivo,
      cursoFK: curso.value,
    };
  
    console.log("Dados a enviar para a API:", dataASubmeter);
  
    setLoading(true);
  
    Api.criarTurma(dataASubmeter)
      .then((response) => {
        console.log('Resposta da API:', response);
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
          navigate('/turmas');
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
        <TextInput id="nome" label="Nome da Turma" value={nome} onChange={(e) => setNome(e.target.value)} />
        <TextInput id="anoLetivo" label="Ano Letivo" value={anoLetivo} onChange={(e) => setAnoLetivo(e.target.value)} />
        <CursoSelect id="curso" label="Curso" value={curso} onChange={setCurso} />
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Criar" />
          <ReturnButton text="Voltar" endpoint="/turmas" />
        </div>
      </form>
    </CriarPage>
  );
}
