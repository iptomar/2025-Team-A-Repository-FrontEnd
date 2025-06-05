import { useEffect, useState } from "react";
import ListaSalas from "../components/Listas/ListaSalas";
import { getSalas } from "../api/api";

function SalasPage() {
  const [salas, setSalas] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getSalas()
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao obter salas: " + res.status);
        return res.json();
      })
      .then((data) => setSalas(data))
      .catch((err) => setErro(err.message));
  }, []);

  if (erro) return <p>Erro: {erro}</p>;
  if (salas === null) return <p>A carregar salas...</p>;

  return (
    <>
      <h2 className="text-center mt-5">Salas</h2>
      <div className="d-flex justify-content-center mt-4">
        <a href="#/criar-sala" className="btn btn-primary">Criar Sala</a>
      </div>
      <div className="pt-4">
        <ListaSalas salas={salas} setSalas={setSalas} />
      </div>
    </>
  );
}

export default SalasPage;