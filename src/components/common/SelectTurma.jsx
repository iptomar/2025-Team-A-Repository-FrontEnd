import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import customDarkStyles from "../../components/DarkModeFiles/darkmode"; // Importa o estilo personalizado para o modo escuro
import useDarkMode from "../../components/DarkModeFiles/useDarkMode"; // Hook personalizado para verificar o modo escuro

export default function TurmasSelect({ value, onChange, isMulti = false, endpoint = "getTurmas" }) {
  const [options, setOptions] = useState([]);
  
  const isDarkMode = useDarkMode(); // Hook personalizado para verificar o modo escuro

  // Atualiza quando o modo escuro muda
  useEffect(() => {
    Api[endpoint]()
      .then((res) => res.json())
      .then((data) => {
        setOptions(
          data.map((d) => ({
            value: d.id,
            label: `${d.curso?.nome} | ${d.anoCurso} | ${d.nome} `,
          }))
        );
      })
      .catch((err) => {
        console.error("Erro ao carregar as turmas:", err);
        toast.error("Erro ao carregar as turmas.");
      });
  }, [endpoint]);

  return (
    <div className="mb-3">
      <label className="form-label">Turma</label>
      <Select
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
        styles={isDarkMode ? customDarkStyles : {}}
      />
    </div>
  );
}