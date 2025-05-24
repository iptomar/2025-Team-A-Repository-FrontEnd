import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import customDarkStyles from "../../css/darkmode";

export default function DocentesSelect({ value, onChange, isMulti = false, endpoint = "getDocentes" }) {
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
    Api.getDocentes()
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.map((d) => ({ value: d.id, label: d.nome })));
      })
      .catch((err) => {
        console.error("Erro ao carregar os docentes:", err);
        toast.error("Erro ao carregar os docentes.");
      });
  }, [endpoint]);

  return (
    <div className="mb-3">
      <label className="form-label">Selecione o Docente</label>
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