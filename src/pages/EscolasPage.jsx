import React from 'react';
import { useEffect, useState } from "react";
import ListaEscolas from "../components/Listas/ListaEscolas";
import { getEscola } from "../api/api";

export default function EscolasPage() {
  const [escolas, setEscolas] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getEscola()
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao obter escolas: " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Escolas recebidas:", data);
        setEscolas(data);
      })
      .catch((err) => {
        console.error(err);
        setErro(err.message);
      });
  }, []);

  if (erro) return <p>Erro: {erro}</p>;

  if (escolas === null) {
    return <p>A carregar Escolas...</p>;
  }

  return (
    <>
      <h2 className="text-center mt-5">Escolas</h2>
      <div className="d-flex justify-content-center mt-4">
        <a href="#/criar-escola" className="btn btn-primary">
          Adicionar Escola
        </a>
      </div>

      <div className="pt-4">
        <ListaEscolas
          escolas={escolas}
          setEscolas={setEscolas}
        />
      </div>
    </>
  );
}
