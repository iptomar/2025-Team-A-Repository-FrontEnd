import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";

export default function TurmasSelect({ value, onChange, isMulti = false, endpoint = "getTurmas" }) {
  const [options, setOptions] = useState([]);

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

  return (
    <div className="mb-3">
      <label className="form-label">Selecione a Turma</label>
      <Select
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}