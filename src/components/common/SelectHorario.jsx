import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Api from "../../api/api";

export default function HorariosSelect({
  value,
  onChange,
  isMulti = false,
  endpoint = "getHorarios",
}) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    Api.getHorarios()
      .then((res) => res.json())
      .then((data) => {
        setOptions(
          data.map((d) => ({
            value: d.id,
            label:
              d.anoLetivo +
              " | " +
              d.semestre +
              "º Semestre | " +
              d.turmaCurso +
              " | " +              
              d.nomeTurma,
          }))
        );
      })
      .catch((err) => {
        console.error("Erro ao carregar os Horários:", err);
        toast.error("Erro ao carregar os Horários.");
      });
  }, [endpoint]);

  return (
    <div className="mb-3">
      <label className="form-label">Selecione o Horário</label>
      <Select
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
