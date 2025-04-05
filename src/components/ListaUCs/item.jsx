import React from 'react';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToastConfirmaDelete from '../../components/ToastConfirmaDelete';
import * as Api from '../../api/api';

export default function ItemUC({ uc, setUnidadesCurriculares }) {
  // Lida com o click do botão de eliminar
  const handleDelete = (id) => {
    // Exibe o toast de confirmação
    toast(
      <ToastConfirmaDelete
        id={id}
        action={apagaUC}  // Passa a ação de apagar para o ToastConfirmaDelete
        item="UC"
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

  // Função para apagar a UC
  function apagaUC(id) {
    console.log('A apagar UC com id:', id);
    Api.apagaUC(id)
      .then((response) => {
        if (response.ok) {
          // Exibe o toast de sucesso APENAS após a exclusão bem-sucedida
          toast.success('UC removida com sucesso!');
          reloadLista();  // Recarrega a lista após a exclusão
        } else {
          toast.error('Falha ao eliminar UC');
        }
      })
      .catch((error) => {
        console.error('Erro ao eliminar UC', error);
        toast.error('Erro ao eliminar UC');
      });
  }

  // Função para recarregar a lista de UCs após exclusão
  const reloadLista = () => {
    Api.getUCs()
      .then((res) => res.json())
      .then((data) => setUnidadesCurriculares(data))  // Atualiza a lista com os dados mais recentes
      .catch((error) => {
        console.error('Erro ao recarregar as UCs', error);
        toast.error('Erro ao recarregar a lista de UCs');
      });
  };

  return (
    <tr key={uc.id}>
      <td className="px-4">{uc.nome}</td>
      <td className="px-4">{uc.plano}</td>
      <td className="px-4">{uc.semestre}</td>
      <td className="px-4">{uc.ano}</td>
      <td className="px-4">
        {uc.cursos.map((curso, index) => (
          <div key={index}>{curso}</div>
        ))}
      </td>
      <td className="px-4">
        <a title="Ver" className="btn btn-info btn-sm me-2" href={`/#/unidades_curriculares/detalhes/${uc.id}`}>
          <HiEye />
        </a>
        <a title="Editar" className="btn btn-warning btn-sm me-2" href={`/#/unidades_curriculares/editar/${uc.id}`}>
          <HiPencil />
        </a>
        <button title="Apagar" className="btn btn-danger btn-sm" onClick={() => handleDelete(uc.id)}>
          <HiTrash />
        </button>
      </td>
    </tr>
  );
}
