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
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mb-3">
      <label className="form-label">Selecione a Turma</label>
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