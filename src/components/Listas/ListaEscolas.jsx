import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

export default function ListaEscolas() {
  return (
    <Lista
      endpoint={Api.getEscola}
      colunas={["Nome"]}
      nomeEntidade="Escola"
      deleteFn={Api.apagaEscola}
      renderItem={(escola, handleDelete, highlight) => (
        <Item
          key={escola.id}
          item={escola}
          campos={[
            (e) => highlight(e.nome),
          ]}
          detalhes="escolas/detalhes"
          editar="escolas/editar"
          deleteFn={handleDelete}
        />
      )}
    />
  );
}