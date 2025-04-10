import Detalhes from "./Detalhes";
import * as Api from "../../api/api";

export default function DetalhesTurma() {
  return (
    <Detalhes
      entidadeNome="Turma"
      campos={[
        { label: "Nome", key: "nome" },
        { label: "Ano Letivo", key: "anoLetivo" },
        { label: "Curso", key: "curso.nome" },
      ]}
      fetchFn={Api.getDetalheTurma}
      voltarPath="/turmas"
    />
  );
}
