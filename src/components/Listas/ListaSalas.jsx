import React from "react";
import * as Api from "../../api/api";
import Lista from "../common/Lista";
import Item from "../common/Item";

function ListaSalas() {
    return (
        <Lista
            endpoint={Api.getSalas}
            colunas={["Nome", "Escola"]}
            nomeEntidade="Sala"
            deleteFn={Api.apagaSala}
            renderItem={(sala, handleDelete, highlight) => (
                <Item
                    key={sala.id}
                    item={sala}
                    campos={[
                        (s) => highlight(s.nome),
                        (s) => highlight(s.escola),
                    ]}
                    detalhes="salas/detalhes"
                    editar="salas/editar"
                    deleteFn={handleDelete}
                />
            )}
        />
    );
}

export default ListaSalas;
