import Detalhes from "./Detalhes";
import * as Api from "../../api/api";

export default function DetalhesEscola() {
  return (
    <Detalhes
      entidadeNome="Escolas"
      campos={[
        { label: "Nome", key: "nome" },
      ]}
      fetchFn={Api.getDetalheEscola}
      voltarPath="/escolas"
    />
  );
}
