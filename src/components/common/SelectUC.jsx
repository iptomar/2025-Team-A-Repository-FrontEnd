import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";

export default function UCSSelect({ value, onChange, isMulti = false, endpoint = "getUCs" }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    Api.getUCs()
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.map((d) => ({ value: d.id, label: d.nome })));
      })
      .catch((err) => {
        console.error("Erro ao carregar as unidades curriculares:", err);
        toast.error("Erro ao carregar as unidades curriculares.");
      });
  }, [endpoint]);

  return (
    <div className="mb-3">
      <label className="form-label">Selecione a Unidade Curricular</label>
      <Select
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}