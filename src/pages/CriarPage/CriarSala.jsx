import { useEffect, useState } from "react";
import { criarSala, getEscola } from "../../api/api";
import { useNavigate } from "react-router-dom";
import CriarPage from "./CriarPage"; 
import Select from "react-select"; 
import SubmitButton from "../../components/common/SubmitButton"; 
import ReturnButton from "../../components/common/ReturnButton"; 
import { toast } from "react-toastify"; 
import customDarkStyles from "../../css/darkmode"; // Estilos personalizados para o modo escuro

function CriarSala() {
  const [nome, setNome] = useState(""); // estado para o nome da sala
  const [escolaSelecionada, setEscolaSelecionada] = useState(null); // estado para a escola selecionada
  const [listaEscolas, setListaEscolas] = useState([]); // lista de escolas formatada para o Select
  const [loading, setLoading] = useState(false); // estado de loading
  const navigate = useNavigate(); // hook para navegação

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

  // Carrega escolas ao montar o componente
  // e formata para o Select
  useEffect(() => {
    getEscola()
      .then(res => res.json())
      .then(data => {
        const escolas = data.map(e => ({ value: e.id, label: e.nome }));
        setListaEscolas(escolas);
      })
      .catch(() => toast.error("Erro ao carregar escolas"));
  }, []);

  // Função para lidar com o envio do formulário
  // Valida os campos e envia os dados para a API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação antes de enviar
    if (!nome || !escolaSelecionada) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    // Encontra a escola selecionada na lista bruta
    const novaSala = {
      nome,
      escolaFK: escolaSelecionada.value, // ID da escola selecionada
    };

    // Log para depuração
    console.log("Sala a criar:", novaSala);

    // Envia os dados para a API
    // e lida com a resposta
    setLoading(true);
    try {
      const res = await criarSala(novaSala);
      if (res.ok) {
        toast.success("Sala criada com sucesso!");
        navigate("/salas");
      } else {
        toast.error("Erro ao criar sala.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar sala.");
    } finally {
      setLoading(false);
    }
  };

  // Renderiza o formulário de criação de sala
  // com os campos necessários
  return (
    <CriarPage titulo="Criar Sala"> {/* usar o layout padrão */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome da Sala</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </div>

        {/* Campo de seleção de escola usando react-select */}
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

        {/* Botões de ação: Criar e Voltar */}
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Criar" />
          <ReturnButton text="Voltar" endpoint="/salas" />
        </div>
      </form>
    </CriarPage>
  );
}

export default CriarSala;