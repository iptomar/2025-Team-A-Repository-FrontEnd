import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

export default function ListaTurmas() {
  return (
    <Lista
      endpoint={Api.getTurmas}
      colunas={["Nome", "Ano do Curso", "Curso"]}
      nomeEntidade="Turma"
      deleteFn={Api.apagaTurma}
      renderItem={(turma, handleDelete, highlight) => (
        <Item
          key={turma.id}
          item={turma}
          campos={[
            (t) => highlight(t.nome),
            (t) => highlight(t.anoCurso?.toString() || ""),
            (t) => highlight(t.curso?.nome || ""),
          ]}
          detalhes="turmas/detalhes"
          editar="turmas/editar"
          deleteFn={handleDelete}
        />
      )}
    />
  );
}
