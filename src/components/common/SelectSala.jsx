import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";

export default function SalasSelect({ value, onChange, isMulti = false, endpoint = "getSalas" }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    Api.getSalas()
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.map((d) => ({ value: d.id, label: d.nome })));
      })
      .catch((err) => {
        console.error("Erro ao carregar as salas:", err);
        toast.error("Erro ao carregar as salas.");
      });
  }, [endpoint]);

  return (
    <div className="mb-3">
      <label className="form-label">Selecione a Sala</label>
      <Select
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}