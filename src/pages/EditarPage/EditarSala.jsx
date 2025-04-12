import { useEffect, useState } from "react";
import { updateSala, getDetalheSala, getEscola } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

function EditarSala() {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [escolaFK, setEscolaFK] = useState("");
  const [escolas, setEscolas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDetalheSala(id).then(res => res.json()).then(s => {
      setNome(s.nome);
      setEscolaFK(s.escolaFK);
    });
    getEscola().then(res => res.json()).then(setEscolas);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSala(id, { nome, escolaFK: parseInt(escolaFK) });
    navigate("/salas");
  };

  return (
    <div className="container mt-5">
      <h2>Editar Sala</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Escola</label>
          <select className="form-control" value={escolaFK} onChange={e => setEscolaFK(e.target.value)} required>
            <option value="">Escolha uma escola</option>
            {escolas.map(esc => <option key={esc.id} value={esc.id}>{esc.nome}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}

export default EditarSala;