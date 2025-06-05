import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

export default function ListaUtilizadores() {
    return (
        <Lista
            endpoint={Api.getUtilizadores}
            colunas={["Nome", "Email", "Email Confirmado"]}
            nomeEntidade="Utilizador"
            deleteFn={Api.eliminaUtilizador}
            renderItem={(utilizador, handleDelete, highlight) => (
                <Item
                    key={utilizador.id}
                    item={utilizador}
                    campos={[
                        (e) => highlight(e.nome),
                        (e) => highlight(e.email),
                        (e) => e.emailConfirmed ? "✅" : "❌",
                    ]}
                    detalhes="utilizadores/detalhes"
                    editar="utilizadores/editar"
                    deleteFn={handleDelete}
                />
            )}
        />
    );
}