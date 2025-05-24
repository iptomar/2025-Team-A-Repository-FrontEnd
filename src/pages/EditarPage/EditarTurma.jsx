import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import CursoSelect from "../../components/common/SelectCurso";
import EditarPage from "./EditarPage";
import ReturnButton from "../../components/common/ReturnButton";
import { Select, MenuItem } from "@mui/material";
import customDarkStyles from "../../css/darkmode";

export default function EditarTurma() {
  const [nome, setNome] = useState("");
  const [anoCurso, setanoCurso] = useState("");
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [turma, setTurma] = useState(null);
  const [cursos, setCursos] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains("dark-mode")); // Estado para verificar se o modo escuro está ativo
    
      // Hook de efeito para verificar o modo escuro
      useEffect(() => {
        const observer = new MutationObserver(() => { // Observa mudanças na classe do body
          setIsDarkMode(document.body.classList.contains("dark-mode")); // Atualiza o estado se o modo escuro estiver ativo
        });
        // Inicia a observação do body para mudanças de classe
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
        // Limpa o observer quando o componente é desmontado
        return () => observer.disconnect();
      }, []); 

  // Carregar dados da turma e cursos disponíveis
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados da turma
        const resTurma = await Api.getDetalheTurma(id);
        const turmaData = await resTurma.json();

        setTurma(turmaData);
        setNome(turmaData.nome);
        setanoCurso(turmaData.anoCurso);

        // Buscar a lista de cursos
        const resCursos = await Api.getCursos();
        const cursosData = await resCursos.json();
        setCursos(
          cursosData.map((curso) => ({
            value: curso.codCurso,
            label: curso.nome,
          }))
        );

        // Definir curso selecionado
        const cursoEncontrado = cursosData.find(
          (curso) => curso.codCurso === turmaData.cursoFK
        );
        if (cursoEncontrado) {
          setCursoSelecionado({
            value: cursoEncontrado.codCurso,
            label: cursoEncontrado.nome,
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast.error("Erro ao carregar os dados.");
      }
    };

    fetchData();
  }, [id]);

  // Função de envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!nome || !anoCurso || !cursoSelecionado) {
      toast.error("Por favor, preencha todos os campos e selecione um curso.");
      return;
    }

    const dataASubmeter = {
      id: id,
      nome: nome,
      anoCurso: anoCurso,
      cursoFK: cursoSelecionado.value,
    };

    setLoading(true);

    Api.updateTurma(id, dataASubmeter)
      .then((response) => {
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
          toast.success("Turma editada com sucesso!");
          navigate("/turmas");
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao editar a turma.");
        console.error(error);
      });
  };

  if (!turma || cursos.length === 0) {
    return <div>Carregando...</div>;
  }

  return (
    <EditarPage titulo="Editar Turma">
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
          value={cursoSelecionado}
          onChange={setCursoSelecionado}
          options={cursos}
          styles={isDarkMode ? customDarkStyles : {}} // Aplica estilos personalizados
        />
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Editar Turma" />
          <ReturnButton text="Voltar" endpoint="/turmas" />
        </div>
      </form>
    </EditarPage>
  );
}
