import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";

export default function DocentesSelect({ value, onChange, isMulti = false, endpoint = "getDocentes" }) {
  const [options, setOptions] = useState([]);

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
      />
    </div>
  );
}