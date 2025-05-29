import { useEffect, useState } from "react";
import { updateSala, getDetalheSala, getEscola } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import CriarPage from "../CriarPage/CriarPage"; 
import Select from "react-select"; 
import SubmitButton from "../../components/common/SubmitButton"; 
import ReturnButton from "../../components/common/ReturnButton"; 
import { toast } from "react-toastify"; 
import customDarkStyles from "../../components/DarkModeFiles/darkmode"; // Importa o estilo personalizado para o modo escuro
import useDarkMode from "../../components/DarkModeFiles/useDarkMode"; // Hook personalizado para verificar o modo escuro

function EditarSala() {
  const { id } = useParams(); // id da sala a editar
  const [nome, setNome] = useState(""); // estado para o nome da sala
  const [escolaSelecionada, setEscolaSelecionada] = useState(null); // estado para a escola selecionada
  const [listaEscolas, setListaEscolas] = useState([]); // lista para o select
  const [loading, setLoading] = useState(false); // estado loading
  const navigate = useNavigate(); // hook para navegação

  const isDarkMode = useDarkMode(); // Verifica se o modo escuro está ativo

  useEffect(() => {
    getDetalheSala(id)
      .then(res => res.json())
      .then(s => {
        setNome(s.nome);
        if (s.escolaFK) {
          setEscolaSelecionada({ value: s.escolaFK, label: s.escola });
        }
      })
      .catch(() => toast.error("Erro ao carregar detalhes da sala."));

    // Carrega escolas ao montar o componente
    getEscola()
      .then(res => res.json())
      .then(data => {
        const escolas = data.map(e => ({ value: e.id, label: e.nome }));
        setListaEscolas(escolas);
      })
      .catch(() => toast.error("Erro ao carregar escolas."));
  }, [id]);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !escolaSelecionada) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    // Encontra a escola selecionada na lista 
    const salaAtualizada = {
      nome,
      escolaFK: escolaSelecionada.value,
    };

    // Log para depuração
    console.log("Sala atualizada:", salaAtualizada);

    // Envia os dados para a API
    setLoading(true);
    try {
      const res = await updateSala(id, salaAtualizada);
      if (res.ok) {
        toast.success("Sala atualizada com sucesso!");
        navigate("/salas");
      } else {
        toast.error("Erro ao atualizar sala.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar sala.");
    } finally {
      setLoading(false);
    }
  };

  // Renderiza o formulário de edição de sala
  return (
    <CriarPage titulo="Editar Sala"> {/* usar o layout padrão */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome da Sala</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        {/* Select para escolher a escola */}
        <div className="mb-3">
          <label className="form-label">Escola</label>
          <Select
            options={listaEscolas}
            value={escolaSelecionada}
            onChange={setEscolaSelecionada}
            placeholder="Escolha uma escola"
            required
            styles={isDarkMode ? customDarkStyles : {}} // Aplica estilos personalizados
          />
        </div>

        {/* Botões de ação */}
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Guardar" />
          <ReturnButton text="Voltar" endpoint="/salas" />
        </div>
      </form>
    </CriarPage>
  );
}

export default EditarSala;
