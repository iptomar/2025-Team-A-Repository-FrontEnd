import Detalhes from "./Detalhes";
import * as Api from "../../api/api";

export default function DetalhesUtilizador() {
    const renderRole = (roleId) => {
        switch (roleId?.trim()) {  
            case "A":
                return "Administrador";
            case "CH":
                return "Comissão de Horários";
            case "CC":
                return "Comissão de Curso";
            default:
                return "Sem função definida";
        }
    };

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
                { label: "Função", key: "roleId", render: (roleId) => renderRole(roleId) },
            ]}
            fetchFn={Api.getDetalhesUtilizador}
            voltarPath="/utilizadores"
        />
    );
}
