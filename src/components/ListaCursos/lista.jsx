import { useEffect, useState } from 'react';
import ItemCurso from './item';

export default function ListaCursos({ cursos, setCursos }) {
    console.log(cursos); // Verifica as props recebidas

    return (
        <div className="container mt-4">
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th className='px-4'>Código</th>
                            <th className='px-4'>Curso</th>
                            <th className='px-4'>Escola</th>
                            <th className='px-4'>Unidades Curriculares</th>
                            <th className='px-4'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cursos.map((curso) => (
                            <ItemCurso
                                key={curso.codCurso}
                                curso={curso}
                                setCursos={setCursos}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
