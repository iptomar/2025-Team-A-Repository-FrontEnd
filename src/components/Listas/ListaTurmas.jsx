import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

export default function ListaTurmas() {
  return (
    <Lista
      endpoint={Api.getTurmas}
      colunas={["Nome", "Ano Letivo", "Curso"]}
      nomeEntidade="Turma"
      deleteFn={Api.apagaTurma}
      renderItem={(turma, handleDelete) => (
        <Item
          key={turma.id}
          item={turma}
          campos={[
            (t) => t.nome,
            (t) => t.anoLetivo,
            (t) => t.curso?.nome,
          ]}
          detalhes="turmas/detalhes"
          editar="turmas/editar"
          deleteFn={handleDelete}
        />
      )}
    />
  );
}