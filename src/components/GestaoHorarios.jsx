import React from "react";

const GestaoHorarios = ({
  horarios,
  horarioSelecionado,
  setHorarioSelecionado,
  mostrarCriar,
  setMostrarCriar,
  novoHorarioNome,
  setNovoHorarioNome,
  criarHorario,
  carregarManchasDoHorario,
}) => {
  return (
    <div className="card shadow-sm mb-4" style={{ margin: "1rem" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Gestão de Horários</h5>
          {horarioSelecionado && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setHorarioSelecionado(null)}
            >
              Mudar horário
            </button>
          )}
        </div>

        {!horarioSelecionado && (
          <>
            <div className="mt-3 mb-3">
              <label className="form-label">Selecionar horário existente</label>
              <select
                className="form-select"
                value={horarioSelecionado?.id || ""}
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  const h = horarios.find((h) => h.id === id);
                  setHorarioSelecionado(h);
                  carregarManchasDoHorario(h.id);
                }}
              >
                <option value="">Selecione um horário</option>
                {horarios.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nome}
                  </option>
                ))}
              </select>
            </div>

            {!mostrarCriar ? (
              <button
                className="btn btn-link p-0"
                onClick={() => setMostrarCriar(true)}
              >
                + Criar novo horário
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  criarHorario(novoHorarioNome);
                }}
              >
                <div className="mb-3">
                  <label className="form-label">Nome do novo horário</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: 2024/25 LEI 1ºA"
                    value={novoHorarioNome}
                    onChange={(e) => setNovoHorarioNome(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Criar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setMostrarCriar(false);
                      setNovoHorarioNome("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {horarioSelecionado && (
          <p className="text-muted mt-2">
            A visualizar: <strong>{horarioSelecionado.nome}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default GestaoHorarios;
