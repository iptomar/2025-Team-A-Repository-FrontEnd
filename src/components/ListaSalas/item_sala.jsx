import React from 'react';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToastConfirmaDelete from '../../components/ToastConfirmaDelete';
import * as Api from '../../api/api';

function ItemSala({ sala, setSalas }) {

  // Lida com o click do botão de eliminar
  const apagar = (id) => {
      toast(
          <ToastConfirmaDelete
              id={id}
              action={apagaSala}
              item="Sala"
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
  
// Função para apagar o sala
    function apagaSala(id) {
        console.log('A apagar sala com id:', id);
        Api.apagaSala(id)
            .then((response) => {
                if (response.ok) {
                    toast.success('Sala removida com sucesso!');
                    reloadLista();
                } else {
                    toast.error('Falha ao eliminar sala');
                }
            })
            .catch((error) => {
                console.error('Erro ao eliminar sala', error);
                toast.error('Erro ao eliminar sala');
            });
    }

    // Função para recarregar a lista de salas
    const reloadLista = () => {
        Api.getSalas()
            .then((res) => res.json())
            .then((data) => setSalas(data))
            .catch((error) => {
                console.error('Erro ao recarregar os salas', error);
                toast.error('Erro ao recarregar a lista de salas');
            });
    };

  return (
    <tr>
      <td>{sala.nome}</td>
      <td>{sala.escola}</td>
      <td>
        <a href={`#/salas/detalhes/${sala.id}`} className="btn btn-info btn-sm me-2"><HiEye /></a>
        <a href={`#/salas/editar/${sala.id}`} className="btn btn-warning btn-sm me-2"><HiPencil /></a>
        <button onClick={() => apagar(sala.id)} className="btn btn-danger btn-sm"><HiTrash /></button>
      </td>
    </tr>
  );
}

export default ItemSala;