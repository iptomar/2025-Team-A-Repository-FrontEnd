import { useEffect, useState } from "react";
import { getDetalheSala } from "../../api/api";
import { useParams} from "react-router-dom";
import CriarPage from "../CriarPage/CriarPage"; 
import ReturnButton from "../../components/common/ReturnButton"; 
import { toast } from "react-toastify"; 

// Função para obter os detalhes da sala
// e exibir as informações
function DetalhesSala() {
  const { id } = useParams();
  const [sala, setSala] = useState(null);

  // Carrega os detalhes da sala ao montar o componente
  // e formata para o Select
  useEffect(() => {
    getDetalheSala(id)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao obter sala.");
        return res.json();
      })
      .then(setSala)
      .catch((error) => {
        console.error(error);
        toast.error("Erro ao carregar detalhes da sala.");
      });
  }, [id]);

  // Verifica se houve erro ao carregar os detalhes
  if (!sala) return <p className="text-center mt-5">A carregar detalhes...</p>; // Melhorado o carregamento

  // Retorna o layout da página com os detalhes da sala
  // e o botão de voltar
  return (
    <CriarPage titulo="Detalhes da Sala"> {/* usar o layout padrão */}
    <hr />
      <div className="text-center mb-4">
        <p><strong>Nome:</strong> {sala.nome}</p>
        <p><strong>Escola:</strong> {sala.escola}</p>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <ReturnButton text="Voltar" endpoint="/salas" /> {/* Botão "Voltar" */}
      </div>
    </CriarPage>
  );
}

export default DetalhesSala;
