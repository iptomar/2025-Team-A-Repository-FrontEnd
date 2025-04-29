import Detalhes from "./Detalhes";
import * as Api from "../../api/api";

export default function DetalhesManchaHoraria() {
  return (
    <Detalhes
      entidadeNome="da Mancha Horaria"
      campos={[
        { label: "Unidade Curricular", key: "uc.nome" },
        { label: "Docente", key: "docente.nome" },
        { label: "Tipo de Aula", key: "tipoDeAula" },
        { label: "Sala", key: "sala.nome" },
        { label: "Número de Slots", key: "numSlots" },
      ]}
      fetchFn={Api.getDetalhesManchaHoraria}
      voltarPath="/manchas_horarias"
    />
  );
}
