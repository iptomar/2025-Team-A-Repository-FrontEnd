import React from 'react';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToastConfirmaDelete from '../../components/ToastConfirmaDelete';
import * as Api from '../../api/api';

export default function ItemCurso({ curso, setCursos, highlight = (t) => t }) {
    // Lida com o click do botão de eliminar
    const handleDelete = (id) => {
        toast(
            <ToastConfirmaDelete
                id={id}
                action={apagaCurso}
                item="Curso"
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

    // Função para apagar o curso
    function apagaCurso(id) {
        console.log('A apagar curso com id:', id);
        Api.apagaCurso(id)
            .then((response) => {
                if (response.ok) {
                    toast.success('Curso removido com sucesso!');
                    reloadLista();
                } else {
                    toast.error('Falha ao eliminar curso');
                }
            })
            .catch((error) => {
                console.error('Erro ao eliminar curso', error);
                toast.error('Erro ao eliminar curso');
            });
    }

    // Função para recarregar a lista de cursos
    const reloadLista = () => {
        Api.getCursos()
            .then((res) => res.json())
            .then((data) => setCursos(data))
            .catch((error) => {
                console.error('Erro ao recarregar os Cursos', error);
                toast.error('Erro ao recarregar a lista de cursos');
            });
    };

    return (
        <tr key={curso.codCurso}>
            <td className="px-4">{highlight(curso.codCurso)}</td>
            <td className="px-4">{highlight(curso.nome)}</td>
            <td className="px-4">{highlight(curso.escola?.nome)}</td>
            <td className="px-4">
                <a title="Ver" className="btn btn-info btn-sm me-2" href={`/#/cursos/detalhes/${curso.codCurso}`}>
                    <HiEye />
                </a>
                <a title="Editar" className="btn btn-warning btn-sm me-2" href={`/#/cursos/editar/${curso.codCurso}`}>
                    <HiPencil />
                </a>
                <button title="Apagar" className="btn btn-danger btn-sm" onClick={() => handleDelete(curso.codCurso)}>
                    <HiTrash />
                </button>
            </td>
        </tr>

    );
}
