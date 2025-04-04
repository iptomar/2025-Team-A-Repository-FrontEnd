import { useEffect, useState } from "react";
import ListaUC from "../components/ListaUCs/lista";
import { getUCs } from "../api/api";

export default function UnidadesCurricularesPage() {
  const [unidadesCurriculares, setUnidadesCurriculares] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getUCs()
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao obter UCs: " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("UCs recebidas:", data);
        setUnidadesCurriculares(data);
      })
      .catch((err) => {
        console.error(err);
        setErro(err.message);
      });
  }, []);

  if (erro) return <p>Erro: {erro}</p>;

  if (unidadesCurriculares === null) {
    return <p>A carregar Unidades Curriculares...</p>;
  }

  return (
    <>
      <h2 className="text-center mt-5">Unidades Curriculares</h2>
      <div className="d-flex justify-content-center mt-4">
        <a href="/criar-uc" className="btn btn-primary">
          Criar unidade curricular
        </a>
      </div>

      <div className="pt-4">
        <ListaUC
          unidadesCurriculares={unidadesCurriculares}
          setUnidadesCurriculares={setUnidadesCurriculares} // Passar a função aqui
        />
      </div>
    </>
  );
}
