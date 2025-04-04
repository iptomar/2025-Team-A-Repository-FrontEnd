import { useEffect, useState } from 'react';
import ItemUC from './item';

export default function ListaUCs({ unidadesCurriculares, setUnidadesCurriculares }) {
  console.log(unidadesCurriculares); // Verifica as props recebidas

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className='px-4'>Unidade Curricular</th>
              <th className='px-4'>Plano</th>
              <th className='px-4'>Semestre</th>
              <th className='px-4'>Ano</th>
              <th className='px-4'>Curso(s)</th>
              <th className='px-4'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {unidadesCurriculares.map((uc) => (
              <ItemUC
                key={uc.id}
                uc={uc}
                setUnidadesCurriculares={setUnidadesCurriculares} // Passar setUnidadesCurriculares
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
