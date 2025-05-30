// import React, { useEffect, useState } from "react";
// import { Select, MenuItem } from "@mui/material";
// import SalasSelect from "./common/SelectSala";
// import { toast } from "react-toastify";
// import customDarkStyles from "./DarkModeFiles/darkmode";
// import useDarkMode from "./DarkModeFiles/useDarkMode";

// const GestaoHorariosSalas = ({ setHorarioSalaSelecionado }) => {
//   const [anoLetivo, setAnoLetivo] = useState("");
//   const [semestre, setSemestre] = useState("");
//   const [sala, setSala] = useState(null);
//   const isDarkMode = useDarkMode();

//   // Chama o endpoint quando todos os selects estão preenchidos
//   useEffect(() => {
//     if (anoLetivo && semestre && sala) {
//       setHorarioSalaSelecionado({
//         anoLetivo,
//         semestre,
//         sala,
//       });
//     }
//   }, [anoLetivo, semestre, sala]);

//   return (
//     <div className="card shadow-sm mb-4" style={{ margin: "1rem" }}>
//       <div className="card-body">
//         <h5 className="card-title mb-3">Consultar Horário da Sala</h5>
//         <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
//           {/* Ano Letivo */}
//           <div style={{ flex: 1 }}>
//             <label className="form-label">Ano Letivo</label>
//             <Select
//               fullWidth
//               value={anoLetivo}
//               onChange={(e) => setAnoLetivo(e.target.value)}
//               style={{ height: "40px" }}
//             >
//               <MenuItem value="24/25">24/25</MenuItem>
//               <MenuItem value="25/26">25/26</MenuItem>
//               <MenuItem value="26/27">26/27</MenuItem>
//             </Select>
//           </div>
//           {/* Semestre */}
//           <div style={{ flex: 1 }}>
//             <label className="form-label">Semestre</label>
//             <Select
//               fullWidth
//               value={semestre}
//               onChange={(e) => setSemestre(e.target.value)}
//               style={{ height: "40px" }}
//             >
//               <MenuItem value="1">1º Semestre</MenuItem>
//               <MenuItem value="2">2º Semestre</MenuItem>
//             </Select>
//           </div>
//           {/* Sala */}
//           <div style={{ flex: 2, marginTop: "15px" }}>
//             <SalasSelect
//               id="sala"
//               label="Sala"
//               value={sala}
//               onChange={setSala}
//               styles={isDarkMode ? customDarkStyles : {}}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GestaoHorariosSalas;
import React, { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import SalasSelect from "./common/SelectSala";
import useDarkMode from "./DarkModeFiles/useDarkMode";
import customDarkStyles from "./DarkModeFiles/darkmode";

const GestaoHorariosSalas = ({
  horarioSalaSelecionado,
  setHorarioSalaSelecionado,
}) => {
  const [anoLetivo, setAnoLetivo] = useState("");
  const [semestre, setSemestre] = useState("");
  const [sala, setSala] = useState(null);
  const isDarkMode = useDarkMode();

  // Atualiza o selecionado quando todos os campos estão preenchidos
  React.useEffect(() => {
    if (anoLetivo && semestre && sala) {
      setHorarioSalaSelecionado({
        sala,
        anoLetivo,
        semestre,
      });
    }
  }, [anoLetivo, semestre, sala, setHorarioSalaSelecionado]);

  return (
    <div className="card shadow-sm mb-4" style={{ margin: "1rem" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Gestão de Horários da Sala</h5>
          {/* Botão para mudar a sala selecionada */}
          {horarioSalaSelecionado &&
            horarioSalaSelecionado.anoLetivo &&
            horarioSalaSelecionado.semestre &&
            horarioSalaSelecionado.sala && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setHorarioSalaSelecionado(null);
                  setAnoLetivo("");
                  setSemestre("");
                  setSala(null);
                }}
              >
                Mudar sala
              </button>
            )}
        </div>

        {/* Se nenhuma sala estiver selecionada */}
        {!(horarioSalaSelecionado && horarioSalaSelecionado.sala) && (
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
            {/* Sala */}
            <div style={{ flex: 2, marginTop: "15px" }}>
              <SalasSelect
                id="sala"
                label="Sala"
                value={sala}
                onChange={setSala}
                styles={isDarkMode ? customDarkStyles : {}}
              />
            </div>
          </div>
        )}

        {/* Exibe o nome da sala selecionada */}
        {horarioSalaSelecionado && horarioSalaSelecionado.sala && (
          <p className="text-muted mt-2">
            A visualizar:{" "}
            <strong>
              {horarioSalaSelecionado.sala.label} |{" "}
              {horarioSalaSelecionado.anoLetivo} |{" "}
              {horarioSalaSelecionado.semestre}º Semestre
            </strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default GestaoHorariosSalas;
