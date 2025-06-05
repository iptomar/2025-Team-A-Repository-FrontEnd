import { useState } from 'react';
import ItemCurso from './item';

export default function ListaCursos({ cursos, setCursos }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const tamanhoPagina = 10;
  const MAX_BOTOES = 3;

  const totalPaginas = Math.ceil(cursos.length / tamanhoPagina);
  const blocoAtual = Math.ceil(paginaAtual / MAX_BOTOES);
  const totalBlocos = Math.ceil(totalPaginas / MAX_BOTOES);
  const inicioBloco = (blocoAtual - 1) * MAX_BOTOES + 1;
  const fimBloco = Math.min(blocoAtual * MAX_BOTOES, totalPaginas);

  const cursosPagina = cursos.slice(
    (paginaAtual - 1) * tamanhoPagina,
    paginaAtual * tamanhoPagina
  );

  const irParaPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPaginaAtual(num);
  };

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="px-4">Código</th>
              <th className="px-4">Curso</th>
              <th className="px-4">Escola</th>
              <th className="px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursosPagina.map((curso) => (
              <ItemCurso key={curso.codCurso} curso={curso} setCursos={setCursos} />
            ))}
          </tbody>
        </table>
      </div>

      {cursos.length > tamanhoPagina && (
        <nav aria-label="Paginação" className="d-flex justify-content-center mt-3">
          <ul className="pagination">
            {/* Bloco anterior */}
            <li className={`page-item ${blocoAtual === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => irParaPagina(inicioBloco - MAX_BOTOES)}
                aria-label="Bloco anterior"
              >
                &laquo;
              </button>
            </li>

            {/* Página anterior */}
            <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => irParaPagina(paginaAtual - 1)}
              >
                Anterior
              </button>
            </li>

            {/* Números das páginas no bloco atual */}
            {[...Array(fimBloco - inicioBloco + 1)].map((_, i) => {
              const num = inicioBloco + i;
              return (
                <li key={num} className={`page-item ${paginaAtual === num ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => irParaPagina(num)}>
                    {num}
                  </button>
                </li>
              );
            })}

            {/* Página seguinte */}
            <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => irParaPagina(paginaAtual + 1)}
              >
                Seguinte
              </button>
            </li>

            {/* Bloco seguinte */}
            <li className={`page-item ${blocoAtual === totalBlocos ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => irParaPagina(fimBloco + 1)}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
