import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import customDarkStyles from "../DarkModeFiles/darkmode"; // Importando o estilo personalizado para o modo escuro
import useDarkMode from "../DarkModeFiles/useDarkMode"; // Hook personalizado para verificar o modo escuro

export default function CursoSelect({ value, onChange, isMulti = false, endpoint = "getCursos" }) {
  const [options, setOptions] = useState([]);

  const isDarkMode = useDarkMode(); // Hook personalizado para verificar o modo escuro

  useEffect(() => {
    Api.getCursos()
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.map((c) => ({ value: c.codCurso, label: c.nome })));
      })
      .catch((err) => {
        console.error("Erro ao carregar cursos:", err);
        toast.error("Erro ao carregar os cursos.");
      });
  }, [endpoint]);

  return (
    <div className="mb-3">
      <label className="form-label">Selecione o(s) Curso(s)</label>
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