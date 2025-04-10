import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import ToastConfirmaDelete from "../ToastConfirmaDelete";

export default function Lista({
  endpoint,
  colunas,
  renderItem,
  deleteFn,
  nomeEntidade,
}) {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = (id) => {
    // Exibe o toast de confirmação
    toast(
      <ToastConfirmaDelete
        id={id}
        action={apaga}
        item={nomeEntidade}
        reloadLista={reloadLista}
      />,
      {
        closeOnClick: true,
        close: false,
        autoClose: false,
        position: 'top-center',
      }
    );
  };

  function apaga(id) {
    console.log(`A apagar ${nomeEntidade} com id:`, id);
    deleteFn(id)
      .then((response) => {
        if (response.ok) {
          toast.success(`${nomeEntidade} removido com sucesso!`);
          reloadLista();  // Recarrega a lista após a exclusão
        } else {
          toast.error(`Falha ao eliminar ${nomeEntidade}`);
        }
      })
      .catch((error) => {
        console.error(`Erro ao eliminar ${nomeEntidade}`, error);
        toast.error(`Erro ao eliminar ${nomeEntidade}`);
      });
  }

     // Função para recarregar a lista de UCs após exclusão
     const reloadLista = useCallback(() => {
      setLoading(true);
      endpoint()
        .then((res) => res.json())
        .then((data) => {
          setDados(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(`Erro ao carregar ${nomeEntidade}s:`, err);
          toast.error(`Erro ao carregar ${nomeEntidade}s.`);
          setLoading(false);
        });
    }, [endpoint, nomeEntidade]);
  
    useEffect(() => {
      reloadLista();
    }, [reloadLista]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {colunas.map((coluna, index) => (
                <th key={index} className="px-4">
                  {coluna}
                </th>
              ))}
              <th className="px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => renderItem(item, handleDelete))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
