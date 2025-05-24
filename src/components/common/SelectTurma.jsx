import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import customDarkStyles from "../../css/darkmode";

export default function TurmasSelect({ value, onChange, isMulti = false, endpoint = "getTurmas" }) {
  const [options, setOptions] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => document.body.classList.contains("dark-mode"));
  
  useEffect(() => {
    Api.getTurmas()
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.map((d) => ({ value: d.id, label:  d.curso?.nome + " " + d.nome + " "  + d.anoCurso })));
      })
      .catch((err) => {
        console.error("Erro ao carregar as turmas:", err);
        toast.error("Erro ao carregar as turmas.");
      });
  }, [endpoint]);

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