import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import ToastConfirmaDelete from "../ToastConfirmaDelete";

export default function Lista({
  endpoint,
  colunas,
  renderItem,
  deleteFn,
  nomeEntidade,
  camposParaPesquisa, 
}) {
  const [dadosCompletos, setDadosCompletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [termoPesquisa, setTermoPesquisa] = useState("");

  const tamanhoPagina = 10;
  const MAX_BOTOES = 3;

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
        setDadosCompletos(data);
        setPaginaAtual(1);
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

  // FILTRAGEM adaptada para usar camposParaPesquisa se for fornecida
  const filtrarDados = () => {
    if (!termoPesquisa) return dadosCompletos;

    const termo = termoPesquisa.toLowerCase();

    if (typeof camposParaPesquisa === "function") {
      return dadosCompletos.filter((item) =>
        camposParaPesquisa(item).some((campo) =>
          String(campo).toLowerCase().includes(termo)
        )
      );
    }

    // fallback anterior (pode ser mantido ou removido)
    return dadosCompletos.filter((item) =>
      Object.values(item)
        .flatMap((val) =>
          Array.isArray(val)
            ? val.map((v) => (typeof v === "object" ? JSON.stringify(v) : v))
            : [val]
        )
        .some((val) => String(val).toLowerCase().includes(termo))
    );
  };

  const dadosFiltrados = filtrarDados();
  const totalPaginas = Math.ceil(dadosFiltrados.length / tamanhoPagina);
  const blocoAtual = Math.ceil(paginaAtual / MAX_BOTOES);
  const totalBlocos = Math.ceil(totalPaginas / MAX_BOTOES);
  const inicioBloco = (blocoAtual - 1) * MAX_BOTOES + 1;
  const fimBloco = Math.min(blocoAtual * MAX_BOTOES, totalPaginas);

  const dadosPagina = dadosFiltrados.slice(
    (paginaAtual - 1) * tamanhoPagina,
    paginaAtual * tamanhoPagina
  );

  const irParaPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPaginaAtual(num);
  };

  const highlight = (text) => {
    if (!termoPesquisa || typeof text !== "string") return text;
    const partes = text.split(new RegExp(`(${termoPesquisa})`, "gi"));
    return partes.map((parte, i) =>
      parte.toLowerCase() === termoPesquisa.toLowerCase() ? (
        <mark key={i}>{parte}</mark>
      ) : (
        parte
      )
    );
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container mt-2">
      {/* Campo de pesquisa */}
      <div className="mb-3 text-center">
        <input
          type="text"
          className="form-control w-50 d-inline"
          placeholder="Pesquisar..."
          value={termoPesquisa}
          onChange={(e) => {
            setTermoPesquisa(e.target.value);
            setPaginaAtual(1);
          }}
        />
      </div>

      <div className="d-flex justify-content-center">
        <div className="table-responsive">
          <table className="table table-striped justify-content-center table-sm w-auto">
            <thead>
              <tr>
                {colunas.map((coluna, index) => (
                  <th key={index} className="px-5 text-center">
                    {coluna}
                  </th>
                ))}
                <th className="px-5">Ações</th>
              </tr>
            </thead>
            <tbody>
              {dadosPagina.map((item) =>
                renderItem(item, handleDelete, highlight)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      {dadosFiltrados.length > tamanhoPagina && (
        <nav aria-label="Navegação de páginas" className="d-flex justify-content-center mt-3">
          <ul className="pagination">
            {/* Bloco anterior */}
            <li className={`page-item ${blocoAtual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => irParaPagina(inicioBloco - MAX_BOTOES)}
                aria-label="Bloco anterior"
              >
                &laquo;
              </button>
            </li>

            {/* Página anterior */}
            <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => irParaPagina(paginaAtual - 1)}
                aria-label="Página anterior"
              >
                Anterior
              </button>
            </li>

            {/* Números */}
            {[...Array(fimBloco - inicioBloco + 1)].map((_, i) => {
              const num = inicioBloco + i;
              return (
                <li
                  key={num}
                  className={`page-item ${paginaAtual === num ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => irParaPagina(num)}>
                    {num}
                  </button>
                </li>
              );
            })}

            {/* Página seguinte */}
            <li className={`page-item ${paginaAtual === totalPaginas ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => irParaPagina(paginaAtual + 1)}
                aria-label="Página seguinte"
              >
                Seguinte
              </button>
            </li>

            {/* Bloco seguinte */}
            <li className={`page-item ${blocoAtual === totalBlocos ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => irParaPagina(fimBloco + 1)}
                aria-label="Bloco seguinte"
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
