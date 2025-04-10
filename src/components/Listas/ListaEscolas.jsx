import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

export default function ListaEscolas() {
  return (
    <Lista
      endpoint={Api.getEscolas}
      colunas={["Nome"]}
      nomeEntidade="Escola"
      deleteFn={Api.apagaEscola}
      renderItem={(escola, handleDelete) => (
        <Item
          key={escola.id}
          item={escola}
          campos={[
            (e) => e.nome,
          ]}
          detalhes="escolas/detalhes"
          editar="escolas/editar"
          deleteFn={handleDelete}
        />
      )}
    />
  );
}