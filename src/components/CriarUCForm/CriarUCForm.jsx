import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import customDarkStyles from "../DarkModeFiles/darkmode"; // Importa os estilos personalizados para o modo escuro
import useDarkMode from "../DarkModeFiles/useDarkMode"; // Importa o hook para verificar o modo escuro
import ReturnButton from "../../components/common/ReturnButton"; 

export default function CriarUCForm() {
  const [nome, setNome] = useState("");
  const [plano, setPlano] = useState("");
  const [semestre, setSemestre] = useState("");
  const [ano, setAno] = useState("");
  const [cursosSelecionados, setCursosSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listaCursos, setListaCursos] = useState([]); // Lista de cursos disponíveis
  const [rawCursos, setRawListaCursos] = useState([]); // Dados brutos dos cursos da API

  const isDarkMode = useDarkMode(); // Hook para verificar se o modo escuro está ativo

  const navigate = useNavigate(); // Hook de navegação

  // Hook de efeito para buscar dados e inicializar estados ao carregar o componente
  useEffect(() => {
    Api.getCursos()
    .then((data) => data.json())
    .then((data) => {
      console.log("Dados recebidos da API:", data); // Verificar os dados recebidos da API

      setRawListaCursos(data);

      // Verifica se estamos a mapear corretamente os cursos
      const cursos = data.map((q) => {
        return { value: q.codCurso, label: q.nome };
      });
      console.log("Cursos mapeados:", cursos); // Verifica a lista de cursos mapeados

      setListaCursos(cursos);
    })
    .catch((error) => {
      console.error("Erro ao buscar cursos:", error);
      toast.error("Erro ao carregar os cursos.");
    });
  }, []);

  // Função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificar o estado de cursosSelecionados
    console.log("Cursos selecionados no submit:", cursosSelecionados);

    // Verifica se todos os campos necessários foram preenchidos e ao menos um curso foi selecionado
    if (!nome || !plano || !semestre || !ano || cursosSelecionados.length === 0) {
      toast.error("Por favor, preencha todos os campos e selecione ao menos um curso.");
      return;
    }

    // Mapeia os cursos selecionados e encontra os cursos correspondentes nos dados brutos
    const ListaCursosslecionados = cursosSelecionados
      .map((curso) => {
        console.log(`Procurando o curso com codCurso: ${curso.value}`); 
        const c = rawCursos.find((x) => x.codCurso === curso.value);  // Busca os cursos nos dados brutos
        console.log("Curso encontrado:", c);  // Verifique se o curso foi encontrado
        return c;
      })
      .filter((x) => !!x);  // Remove cursos não encontrados

    console.log("Lista de cursos selecionados:", ListaCursosslecionados);  // Verifique os dados que vão ser enviados para a API

    // Verifica se ListaCursosslecionados tem dados antes de continuar
    if (ListaCursosslecionados.length === 0) {
      toast.error("Nenhum curso foi encontrado. Verifique os cursos selecionados.");
      return;
    }

    const dataASubmeter = {
        Nome: nome,
        Plano: plano,
        Semestre: parseInt(semestre),
        Ano: parseInt(ano),
        unidadeCurricular: {
            Nome: nome,
            Plano: plano,
            Semestre: parseInt(semestre),
            Ano: parseInt(ano),
        },
        ListaCursos: ListaCursosslecionados.map((curso) => ({
            codCurso: curso.codCurso,
            nome: curso.nome,
            escola: curso.escola, 
        })),
    };

    console.log("Dados a enviar para a API:", dataASubmeter);

    setLoading(true);

    Api.criarUc(dataASubmeter)
      .then((data) => data.json())
      .then((data) => {
        setLoading(false);
        if (data.erro) {
          toast.error(data.erro);
        } else {          
          toast.success("UC criada com sucesso!");
          navigate('/unidades_curriculares'); ;
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao criar a UC.");
        console.error(error);
      });
  };

  // Função para lidar com a seleção dos cursos
  const handleSelectChange = (selectedOptions) => {
    setCursosSelecionados(selectedOptions || []);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="nome" className="form-label">
          Nome da UC
        </label>
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
        <label htmlFor="plano" className="form-label">
          Plano da UC
        </label>
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
        <label htmlFor="semestre" className="form-label">
          Semestre
        </label>
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
        <label htmlFor="ano" className="form-label">
          Ano
        </label>
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
        <label htmlFor="cursos" className="form-label">
          Selecione o(s) Curso(s)
        </label>
        <Select
          required
          onChange={handleSelectChange} // Atualiza o estado dos cursos selecionados
          isMulti={true}
          options={listaCursos} // Passa os cursos disponíveis
          value={cursosSelecionados} // Passa os cursos selecionados para o valor da dropdown
          styles={isDarkMode ? customDarkStyles : {}} // Aplica estilos personalizados
        />
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Aguarde..." : "Criar UC"}
        </button>
        <ReturnButton text="Voltar" endpoint="/unidades_curriculares" />
      </div>
    </form>
  );
}
