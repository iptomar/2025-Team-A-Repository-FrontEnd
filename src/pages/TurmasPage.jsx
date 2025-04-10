import { useEffect, useState } from "react";
import ListaTurmas from "../components/Listas/ListaTurmas";
import { getTurmas } from "../api/api";

export default function TurmasPage() {
  const [turmas, setTurmas] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getTurmas()
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao obter turmas: " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Turmas recebidas:", data);
        setTurmas(data);
      })
      .catch((err) => {
        console.error(err);
        setErro(err.message);
      });
  }, []);

  if (erro) return <p>Erro: {erro}</p>;

  if (turmas === null) {
    return <p>A carregar Turmas...</p>;
  }

  return (
    <>
      <h2 className="text-center mt-5">Turmas</h2>
      <div className="d-flex justify-content-center mt-4">
        <a href="#/criar-turma" className="btn btn-primary">
          Criar Turma
        </a>
      </div>

      <div className="pt-4">
        <ListaTurmas
          turmas={turmas}
          setTurmas={setTurmas}
        />
      </div>
    </>
  );
}
