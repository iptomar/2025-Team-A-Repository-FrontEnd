import { useEffect, useState } from "react";
import { getDetalheSala } from "../../api/api";
import { useParams} from "react-router-dom";
import CriarPage from "../CriarPage/CriarPage"; 
import ReturnButton from "../../components/common/ReturnButton"; 
import { toast } from "react-toastify"; 

function DetalhesSala() {
  const { id } = useParams();
  const [sala, setSala] = useState(null);

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

  if (!sala) return <p className="text-center mt-5">A carregar detalhes...</p>; // Melhorado o carregamento

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
