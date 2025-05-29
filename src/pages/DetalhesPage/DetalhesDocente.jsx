import Detalhes from "./Detalhes";
import * as Api from "../../api/api";

export default function DetalhesDocente() {
  return (
    <Detalhes
      entidadeNome="do Docente"
      campos={[
        { label: "Nome", key: "nome" },
        { label: "Email", key: "email" },
      ]}
      fetchFn={Api.getDetalhesDocente}
      voltarPath="/docentes"
    />
  );
}
