import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import customDarkStyles from "../../css/darkmode";

export default function CursoSelect({ value, onChange, isMulti = false, endpoint = "getCursos" }) {
  const [options, setOptions] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains("dark-mode")); // Estado para verificar se o modo escuro está ativo
  
    // Hook de efeito para verificar o modo escuro
    useEffect(() => {
      const observer = new MutationObserver(() => { // Observa mudanças na classe do body
        setIsDarkMode(document.body.classList.contains("dark-mode")); // Atualiza o estado se o modo escuro estiver ativo
      });
      // Inicia a observação do body para mudanças de classe
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
      // Limpa o observer quando o componente é desmontado
      return () => observer.disconnect();
    }, []); 

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