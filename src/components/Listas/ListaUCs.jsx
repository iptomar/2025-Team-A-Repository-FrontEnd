import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

export default function ListaUCs() {
    return (
        <Lista
            endpoint={Api.getUCs}
            colunas={["Unidade Curricular", "Plano", "Semestre", "Ano", "Curso(s)"]}
            nomeEntidade="Unidade Curricular"
            deleteFn={Api.apagaUC}
            renderItem={(uc, handleDelete, highlight) => (
                <Item
                    key={uc.id}
                    item={uc}
                    campos={[
                        (u) => highlight(u.nome),
                        (u) => highlight(u.plano),
                        (u) => highlight(u.semestre.toString()),
                        (u) => highlight(u.ano.toString()),
                        (u) => highlight(u.cursos?.join(", ")),
                    ]}
                    detalhes="ucs/detalhes"
                    editar="ucs/editar"
                    deleteFn={handleDelete}
                />
            )}
        />
    );
}
