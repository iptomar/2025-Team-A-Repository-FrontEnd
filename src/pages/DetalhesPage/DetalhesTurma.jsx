import Detalhes from "./Detalhes";
import * as Api from "../../api/api";

export default function DetalhesTurma() {
  return (
    <Detalhes
      entidadeNome="da Turma"
      campos={[
        { label: "Nome", key: "nome" },
        { label: "Ano Curso", key: "anoCurso" },
        { label: "Curso", key: "curso.nome" },
      ]}
      fetchFn={Api.getDetalheTurma}
      voltarPath="/turmas"
    />
  );
}
