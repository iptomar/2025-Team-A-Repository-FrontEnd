import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

export default function ListaDocentes() {
  return (
    <Lista
      endpoint={Api.getDocentes}
      colunas={["Nome", "Email"]}
      nomeEntidade="Docente"
      deleteFn={Api.eliminaDocente}
      renderItem={(docente, handleDelete, highlight) => (
        <Item
          key={docente.id}
          item={docente}
          campos={[
            (e) => highlight(e.nome),
            (e) => highlight(e.email),
          ]}
          detalhes="docentes/detalhes"
          editar="docentes/editar"
          deleteFn={handleDelete}
        />
      )}
    />
  );
}