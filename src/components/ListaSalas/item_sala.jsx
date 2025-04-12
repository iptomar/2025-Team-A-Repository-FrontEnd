import { apagaSala, getSalas } from "../../api/api";

function ItemSala({ sala, setSalas }) {
  const apagar = async () => {
    if (confirm("Tem a certeza que deseja eliminar esta sala?")) {
      await apagaSala(sala.id);
      const atualizadas = await getSalas().then(res => res.json());
      setSalas(atualizadas);
    }
  };

  return (
    <tr>
      <td>{sala.nome}</td>
      <td>{sala.escola}</td>
      <td>
        <a href={`#/salas/detalhes/${sala.id}`} className="btn btn-info btn-sm me-1">👁</a>
        <a href={`#/salas/editar/${sala.id}`} className="btn btn-warning btn-sm me-1">✏️</a>
        <button onClick={apagar} className="btn btn-danger btn-sm">🗑</button>
      </td>
    </tr>
  );
}

export default ItemSala;