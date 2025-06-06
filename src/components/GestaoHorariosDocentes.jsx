import React, { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import DocentesSelect from "./common/SelectDocente";
import useDarkMode from "./DarkModeFiles/useDarkMode";
import customDarkStyles from "./DarkModeFiles/darkmode";

const GestaoHorariosDocentes = ({
  horarioDocenteSelecionado,
  setHorarioDocenteSelecionado,
}) => {
  const [anoLetivo, setAnoLetivo] = useState("");
  const [semestre, setSemestre] = useState("");
  const [docente, setDocente] = useState(null);
  const isDarkMode = useDarkMode();

  // Atualiza o selecionado quando todos os campos estão preenchidos
  React.useEffect(() => {
    if (anoLetivo && semestre && docente) {
      setHorarioDocenteSelecionado({
        docente,
        anoLetivo,
        semestre,
      });
    }
  }, [anoLetivo, semestre, docente, setHorarioDocenteSelecionado]);

  return (
    <div className="card shadow-sm mb-4" style={{ margin: "1rem" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Gestão de Horários do Docente</h5>
          {/* Botão para mudar o horário selecionado */}
          {horarioDocenteSelecionado &&
            horarioDocenteSelecionado.anoLetivo &&
            horarioDocenteSelecionado.semestre &&
            horarioDocenteSelecionado.docente && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setHorarioDocenteSelecionado(null);
                  setAnoLetivo("");
                  setSemestre("");
                  setDocente(null);
                }}
              >
                Mudar docente
              </button>
            )}
        </div>

        {/* Se nenhum docente estiver selecionado */}
        {!(horarioDocenteSelecionado && horarioDocenteSelecionado.docente) && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            {/* Ano Letivo */}
            <div style={{ flex: 1 }}>
              <label className="form-label">Ano Letivo</label>
              <Select
                fullWidth
                value={anoLetivo}
                onChange={(e) => setAnoLetivo(e.target.value)}
                style={{ height: "40px" }}
              >
                <MenuItem value="24/25">24/25</MenuItem>
                <MenuItem value="25/26">25/26</MenuItem>
                <MenuItem value="26/27">26/27</MenuItem>
              </Select>
            </div>
            {/* Semestre */}
            <div style={{ flex: 1 }}>
              <label className="form-label">Semestre</label>
              <Select
                fullWidth
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
                style={{ height: "40px" }}
              >
                <MenuItem value="1">1º Semestre</MenuItem>
                <MenuItem value="2">2º Semestre</MenuItem>
              </Select>
            </div>
            {/* Docente */}
            <div style={{ flex: 2, marginTop: "15px" }}>
              <DocentesSelect
                id="docente"
                label="Docente"
                value={docente}
                onChange={setDocente}
                styles={isDarkMode ? customDarkStyles : {}}
              />
            </div>
          </div>
        )}

        {/* Exibe o nome do docente selecionado */}
        {horarioDocenteSelecionado && horarioDocenteSelecionado.docente && (
          <p className="text-muted mt-2">
            A visualizar:{" "}
            <strong>
              {horarioDocenteSelecionado.docente.label} |{" "}
              {horarioDocenteSelecionado.anoLetivo} |{" "}
              {horarioDocenteSelecionado.semestre}º Semestre
            </strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default GestaoHorariosDocentes;
