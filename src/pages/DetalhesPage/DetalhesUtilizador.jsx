import Detalhes from "./Detalhes";
import * as Api from "../../api/api";

export default function DetalhesUtilizador() {
  return (
    <Detalhes
      entidadeNome="do Utilizador"
      campos={[
        { label: "Nome", key: "nome" },
        { label: "Email", key: "email" },
        {
          label: "Email Confirmado",
          key: "emailConfirmed",
          render: (v) => {
            // Garantir que v é booleano verdadeiro ou falso
            const valorBooleano = v === true || v === "true" || v === 1;
            return valorBooleano ? "✔️" : "❌";
          },
        },
        { label: "Escola", key: "escolaNome" },
        { label: "Curso", key: "cursoNome" },
        { label: "Função", key: "role" },
      ]}
      fetchFn={Api.getDetalhesUtilizador}
      voltarPath="/utilizadores"
    />
  );
}
