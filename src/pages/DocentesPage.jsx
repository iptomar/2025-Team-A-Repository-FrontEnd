import React from 'react';
import { useEffect, useState } from "react";
import ListaDocentes from "../components/Listas/ListaDocentes";
import { getDocentes } from "../api/api";

export default function DocentesPage() {
  const [docentes, setDocentes] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getDocentes()
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao obter docentes: " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Docentes recebidas:", data);
        setDocentes(data);
      })
      .catch((err) => {
        console.error(err);
        setErro(err.message);
      });
  }, []);

  if (erro) return <p>Erro: {erro}</p>;

  if (docentes === null) {
    return <p>A carregar Docentes...</p>;
  }

  return (
    <>
      <h2 className="text-center mt-5">Docentes</h2>
      <div className="d-flex justify-content-center mt-4">
        <a href="#/criar-docente" className="btn btn-primary">
          Adicionar Docente
        </a>
      </div>

      <div className="pt-4">
        <ListaDocentes
          docentes={docentes}
          setDocentes={setDocentes}
        />
      </div>
    </>
  );
}
