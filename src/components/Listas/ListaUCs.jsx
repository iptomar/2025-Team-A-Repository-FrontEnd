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
            renderItem={(uc, handleDelete) => (
                <Item
                    key={uc.id}
                    item={uc}
                    campos={[
                        (u) => u.nome,
                        (u) => u.plano,
                        (u) => u.semestre,
                        (u) => u.ano,
                        (u) => u.cursos?.join(", ") 
                    ]}
                    detalhes="ucs/detalhes"
                    editar="ucs/editar"
                    deleteFn={handleDelete}
                />
            )}
        />
    );
}
