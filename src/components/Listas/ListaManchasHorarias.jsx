import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

export default function ListaManchasHorarias() {
  return (
    <Lista
      endpoint={Api.getManchasHorarias}
      colunas={["Unidade Curricular", "Tipo de Aula", "Professor", "Sala", "Número de Slots"]}
      nomeEntidade="Mancha Horária"
      deleteFn={Api.deleteManchaHoraria}
      renderItem={(manchaHoraria, handleDelete) => (
        <Item
          key={manchaHoraria.id}
          item={manchaHoraria}
          campos={[
            (mh) => mh.uc.nome,
            (mh) => mh.tipoDeAula,
            (mh) => mh.docente.nome,
            (mh) => mh.sala.nome,
            (mh) => mh.numSlots,
          ]}
          detalhes="manchahoraria/detalhes"
          editar="manchahoraria/editar"
          deleteFn={handleDelete}
        />
      )}
    />
  );
}