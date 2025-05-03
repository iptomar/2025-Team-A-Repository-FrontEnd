import { useEffect, useState } from "react";
import ListaUtilizadores from "../components/Listas/ListaUtilizadores";
import { getUtilizadores } from "../api/api";

export default function UtilizadoresPage() {
    const [utilizadores, setUtilizadores] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        getUtilizadores()
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao obter utilizadores: " + res.status);
                return res.json();
            })
            .then((data) => {
                console.log("Utilizadores recebidos:", data);
                setUtilizadores(data);
            })
            .catch((err) => {
                console.error(err);
                setErro(err.message);
            });
    }, []);

    if (erro) return <p>Erro: {erro}</p>;

    if (utilizadores === null) {
        return <p>A carregar Utilizadores...</p>;
    }

    return (
        <>
            <h2 className="text-center mt-5">Utilizadores</h2>
            <div className="d-flex justify-content-center mt-4">
            </div>

            <div className="pt-4">
                <ListaUtilizadores
                    utilizadores={utilizadores}
                    setUtilizadores={setUtilizadores}
                />
            </div>
        </>
    );
}