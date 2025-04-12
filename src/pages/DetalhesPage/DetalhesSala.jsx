import { useEffect, useState } from "react";
import { getDetalheSala } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

function DetalhesSala() {
  const { id } = useParams();
  const [sala, setSala] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDetalheSala(id).then(res => res.json()).then(setSala);
  }, [id]);

  if (!sala) return <p>A carregar...</p>;

  return (
    <div className="container mt-5">
      <h2>Detalhes da Sala</h2>
      <p><strong>Nome:</strong> {sala.nome}</p>
      <p><strong>Escola:</strong> {sala.escola}</p>
      <button onClick={() => navigate("/salas")} className="btn btn-secondary">Voltar</button>
    </div>
  );
}

export default DetalhesSala;