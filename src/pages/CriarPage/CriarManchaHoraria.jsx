import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import CursoSelect from "../../components/common/SelectCurso";
import CriarPage from "./CriarPage";
import ReturnButton from "../../components/common/ReturnButton";
import { Select } from "@mui/material";

export default function CriarManchaHoraria() {
  const [uc, setUc] = useState(null);
  const [tipoAula, setTipoAula] = useState(null);
  const [numSlots, setNumSlots] = useState(0);
  const [docente, setDocente] = useState(null);
  const [sala, setSala] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!uc || !tipoAula || !numSlots || !docente || !sala) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    // Dados a serem enviados no formato esperado pela API
    const dataASubmeter = {
      salaFK: sala.value,
      docenteFK: docente.value,
      tipoAula: tipoAula,
      numSlots: numSlots,
      ucFK: uc.value,
    };

    console.log("Dados a enviar para a API:", dataASubmeter);

    setLoading(true);

    Api.criarManchaHoraria(dataASubmeter)
      .then((response) => {
        console.log("Resposta da API:", response);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.erro) {
          toast.error(data.erro);
        } else {
          toast.success("Mancha horária criada com sucesso!");
          navigate("/turmas");
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao criar a turma.");
        console.error(error);
      });
  };

  return (
    <CriarPage titulo="Criar Turma">
      <form onSubmit={handleSubmit}>
        <UCSSelect
          id="uc"
          label="Unidade Curricular"
          value={uc}
          onChange={setUc}
        />

        <DocentesSelect
          id="docente"
          label="Docente"
          value={docente}
          onChange={setDocente}
        />
        <Select
          id="tipoAula"
          label="Tipo de Aula"
          value={tipoAula}
          onChange={setTipoAula}
        >
          <option value="teorica">TP</option>
          <option value="pratica">PL</option>
        </Select>
        <SalasSelect id="sala" label="Sala" value={sala} onChange={setSala} />

        <TextInput
          id="numSlots"
          label="Número de Slots (30 minutos)"
          type="number"
          value={numSlots}
          onChange={(e) => setNumSlots(e.target.value)}
        />

        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Criar" />
          <ReturnButton text="Voltar" endpoint="/manchas_horarias" />
        </div>
      </form>
    </CriarPage>
  );
}
