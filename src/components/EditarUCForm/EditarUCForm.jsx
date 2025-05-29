import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import customDarkStyles from "../DarkModeFiles/darkmode"; // Importa os estilos personalizados para o modo escuro
import useDarkMode from "../DarkModeFiles/useDarkMode"; // Hook personalizado para verificar o modo escuro

export default function EditarUCForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [plano, setPlano] = useState("");
  const [semestre, setSemestre] = useState("");
  const [ano, setAno] = useState("");

  const [cursosSelecionados, setCursosSelecionados] = useState([]);
  const [rawCursos, setRawCursos] = useState([]);
  const [listaCursos, setListaCursos] = useState([]);
  const [loading, setLoading] = useState(false);

  const isDarkMode = useDarkMode(); // Verifica se o modo escuro está ativo

  // Carrega a UC e os cursos disponíveis
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar a UC pelo ID
        const resUc = await Api.getDetalheUC(id);
        const ucData = await resUc.json();

        setNome(ucData.nome);
        setPlano(ucData.plano);
        setSemestre(ucData.semestre);
        setAno(ucData.ano);

        
        // Buscar a lista de cursos disponíveis
        const resCursos = await Api.getCursos();
        const cursosData = await resCursos.json();

        setRawCursos(cursosData);

        const cursosMapeados = cursosData.map((curso) => ({
          value: curso.codCurso,
          label: curso.nome,
        }));
        setListaCursos(cursosMapeados);

        // Pré-selecionar cursos da UC
        const cursosSelecionadosMapeados = (ucData.cursos || []).map((nomeCurso) => {
          const cursoEncontrado = cursosData.find((curso) => curso.nome === nomeCurso);
          return {
            value: cursoEncontrado?.codCurso,
            label: nomeCurso,
          };
        }).filter(c => c.value); // remove cursos não encontrados
        
        setCursosSelecionados(cursosSelecionadosMapeados);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados da UC.");
      }
    };

    fetchData();
  }, [id]);

  // Quando o utilizador muda os cursos selecionados
  const handleSelectChange = (selected) => {
    setCursosSelecionados(selected || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !plano || !semestre || !ano || cursosSelecionados.length === 0) {
      toast.error("Por favor, preencha todos os campos e selecione pelo menos um curso.");
      return;
    }

    // Reconstrói os dados brutos dos cursos para enviar para o backoffice
    const cursosParaSubmeter = cursosSelecionados
      .map((curso) => rawCursos.find((c) => c.codCurso === curso.value))
      .filter((c) => !!c); // remove nulos

    if (cursosParaSubmeter.length === 0) {
      toast.error("Erro ao processar os cursos selecionados.");
      return;
    }

    const dataASubmeter = {
      Nome: nome, 
      Plano: plano, 
      Semestre: parseInt(semestre),
      Ano: parseInt(ano),
      ListaCursos: cursosParaSubmeter.map((curso) => ({
        codCurso: curso.codCurso, 
        nome: curso.nome, 
        escola: {
          id: curso.escola.id, 
          nome: curso.escola.nome, 
        }
      })),
    };
    
    console.log("Data a submeter:", dataASubmeter);
    

    setLoading(true);

    try {
      const res = await Api.updateUC(id, dataASubmeter);
      const result = await res.json();

      setLoading(false);

      if (result.erro) {
        toast.error(result.erro);
      } else {
        toast.success("UC editada com sucesso!");
        navigate("/unidades_curriculares");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Erro ao editar a UC.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>      
      <div className="mb-3">
        <label htmlFor="nome" className="form-label">Nome da UC</label>
        <input
          type="text"
          className="form-control"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="plano" className="form-label">Plano</label>
        <input
          type="text"
          className="form-control"
          id="plano"
          value={plano}
          onChange={(e) => setPlano(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="semestre" className="form-label">Semestre</label>
        <input
          type="number"
          className="form-control"
          id="semestre"
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="ano" className="form-label">Ano</label>
        <input
          type="number"
          className="form-control"
          id="ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="cursos" className="form-label">Cursos associados</label>
        <Select
          isMulti
          options={listaCursos}
          value={cursosSelecionados}
          onChange={handleSelectChange}
          styles={isDarkMode ? customDarkStyles : {}} // Aplica estilos personalizados
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "A guardar..." : "Guardar alterações"}
      </button>
    </form>
  );
}
