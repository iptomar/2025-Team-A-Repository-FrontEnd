import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import UCSSelect from "../../components/common/SelectUC";
import DocentesSelect from "../../components/common/SelectDocente";
import SalasSelect from "../../components/common/SelectSala";
import CriarPage from "./CriarPage";
import ReturnButton from "../../components/common/ReturnButton";
import { Select, MenuItem} from "@mui/material";

export default function CriarManchaHoraria() {
  const [uc, setUc] = useState(null);
  const [tipoAula, setTipoAula] = useState(null);
  const [numSlots, setNumSlots] = useState(0);
  const [docente, setDocente] = useState(null);
  const [sala, setSala] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
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

    try {
      const response = await Api.criarManchaHoraria(dataASubmeter);
      console.log("Resposta da API:", response);
  
      if (response.data.erro) {
        toast.error(response.data.erro);
      } else {
        toast.success("Mancha horária criada com sucesso!");
        navigate("/manchas_horarias");
      }
    } catch (error) {
      console.error("Erro ao criar a mancha horária:", error);
      toast.error("Ocorreu um erro ao criar a mancha horária.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CriarPage titulo="Criar Mancha Horária">
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
        <label className="form-label">Selecione o Tipo de Aula</label>
          <Select
          style={{marginLeft:'15px', width:'200px'}}
            labelId="tipoAula-label"
            id="tipoAula"
            value={tipoAula}
            onChange={(e) => setTipoAula(e.target.value)}
          >
            <MenuItem value="TP">TP</MenuItem>
            <MenuItem value="PL">PL</MenuItem>
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
