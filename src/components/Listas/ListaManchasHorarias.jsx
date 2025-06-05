import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

export default function ListaManchasHorarias() {
  return (
    <Lista
      endpoint={Api.getManchasHorarias}
      colunas={[
        "Unidade Curricular",
        "Tipo de Aula",
        "Professor",
        "Sala",
        "Horário(s)",
        "Número de Slots",
      ]}
      nomeEntidade="Mancha Horária"
      deleteFn={Api.deleteManchaHoraria}
      camposParaPesquisa={(mh) => [
        mh.uc.nome,
        mh.tipoDeAula,
        mh.docente.nome,
        mh.sala.nome,
        mh.listaHorarios
          .map(
            (h) =>
              `${h.anoLetivo} ${h.turma.curso.nome} ${h.semestre} ${h.turma.anoCurso || ""} ${h.turma.nome}`
          )
          .join(" "),
        mh.numSlots?.toString() || "",
      ]}
      renderItem={(manchaHoraria, handleDelete, highlight) => (
        <Item
          key={manchaHoraria.id}
          item={manchaHoraria}
          campos={[
            (mh) => highlight(mh.uc.nome),
            (mh) => highlight(mh.tipoDeAula),
            (mh) => highlight(mh.docente.nome),
            (mh) => highlight(mh.sala.nome),
            (mh) => {
              const horariosStr = mh.listaHorarios
                .map(
                  (h) =>
                    `${h.anoLetivo} ${h.turma.curso.nome} ${h.semestre} ${
                      h.turma.anoCurso ? `Ano ${h.turma.anoCurso}` : ""
                    } ${h.turma.nome}`
                )
                .join(", ");
              return highlight(horariosStr);
            },
            (mh) => highlight(mh.numSlots?.toString() || ""),
          ]}
          detalhes="manchahoraria/detalhes"
          editar="manchahoraria/editar"
          deleteFn={() => handleDelete(manchaHoraria.id)}
        />
      )}
    />
  );
}
