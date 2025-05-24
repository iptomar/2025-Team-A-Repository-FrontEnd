import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import Select from "react-select";
import { useNavigate, useParams } from 'react-router-dom';
import EditarPage from "./EditarPage";
import ReturnButton from "../../components/common/ReturnButton";
import SubmitButton from "../../components/common/SubmitButton";
import customDarkStyles from "../../css/darkmode";

export default function EditarCurso() {
  const [nome, setNome] = useState("");
  const [codCurso, setCodCurso] = useState("");
  const [escolaSelecionada, setEscolaSelecionada] = useState(null);
  const [listaEscolas, setListaEscolas] = useState([]);
  const [rawEscolas, setRawEscolas] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
  

  // Carregar dados do curso e lista de escolas
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados do curso
        const resCurso = await Api.getDetalheCurso(id);
        const cursoData = await resCurso.json();

        setCodCurso(cursoData.codCurso);
        setNome(cursoData.nome);
        
        // Buscar escolas
        const resEscolas = await Api.getEscola();
        const escolasData = await resEscolas.json();
        
        setRawEscolas(escolasData);
        const escolas = escolasData.map(e => ({ value: e.id, label: e.nome }));
        setListaEscolas(escolas);

        // Definir escola selecionada com base no curso
        const escolaSelecionada = escolas.find(e => e.value === cursoData.escola.id);
        setEscolaSelecionada(escolaSelecionada);

      } catch (err) {
        console.error("Erro ao carregar dados do curso ou escolas:", err);
        toast.error("Erro ao carregar os dados.");
      }
    };

    fetchData();
  }, [id]);

  // Função de envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!nome || !escolaSelecionada) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
  
    const dataASubmeter = {
      codCurso: codCurso,
      nome: nome,
      escola: {  // Enviando a escola completa
        id: escolaSelecionada.value,  // ID da escola
        nome: escolaSelecionada.label, // Nome da escola, se necessário
      },
    };
  
    setLoading(true);
  
    Api.updateCurso(id, dataASubmeter)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.text().then((text) => {
          return text ? JSON.parse(text) : {};
        });
      })
      .then((data) => {
        setLoading(false);
        if (data.erro) {
          toast.error(data.erro);
        } else {
          toast.success("Curso editado com sucesso!");
          navigate('/cursos');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao editar o curso.");
        console.error(error);
      });
  };
  
  

  if (!nome || !listaEscolas.length) {
    return <div>Carregando...</div>;
  }

  return (
    <EditarPage titulo="Editar Curso">
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
          <label className="form-label">Escolha a Escola</label>
          <Select
            options={listaEscolas}
            value={escolaSelecionada}
            onChange={(selected) => setEscolaSelecionada(selected)}
            required
            styles={isDarkMode ? customDarkStyles : {}} // Aplica estilos personalizados
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Editar" />
          <ReturnButton text="Voltar" endpoint="/cursos" />
        </div>
      </form>
    </EditarPage>
  );
}
