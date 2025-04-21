import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import EditarPage from "./EditarPage";
import ReturnButton from "../../components/common/ReturnButton";
import UCSSelect from "../../components/common/SelectUC";
import DocentesSelect from "../../components/common/SelectDocente";
import SalasSelect from "../../components/common/SelectSala";
import { Select, MenuItem } from "@mui/material";
import { ROUTES } from "../../App";

export default function EditarManchaHoraria() {
  const [uc, setUc] = useState(null);
  const [tipoAula, setTipoAula] = useState(null);
  const [numSlots, setNumSlots] = useState(0);
  const [docente, setDocente] = useState(null);
  const [sala, setSala] = useState(null);
  const [listaDocentes, setListaDocentes] = useState([]);
  const [listaUCs, setListaUCs] = useState([]);
  const [listaSalas, setListaSalas] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Carregar dados da turma e cursos disponíveis
  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     // Buscar dados da turma
    //     const resManchaHoraria = await Api.getDetalhesManchaHoraria(id);
    //     const mhData = await resManchaHoraria.json();
    //     console.log("Dados da mancha horária:", mhData);
    //     setDocente(mhData.docente.nome);
    //     setUc(mhData.uc.nome);
    //     setTipoAula(mhData.tipoDeAula);
    //     setSala(mhData.sala.nome);
    //     setNumSlots(mhData.numSlots);

    //     // Obter a lista de docentes
    //     const resDocentes = await Api.getDocentes();
    //     const docentesData = await resDocentes.json();
    //     setListaDocentes(
    //       docentesData.map((d) => ({ value: d.id, label: d.nome }))
    //     );

    //     // Definir o docente selecionado
    //     const docenteEncontrado = docentesData.find(
    //       (d) => d.id === mhData.docenteFK
    //     );
    //     if (docenteEncontrado) {
    //       setDocente({
    //         value: docenteEncontrado.id,
    //         label: docenteEncontrado.nome,
    //       });
    //     }

    //     // Obter a lista de UCs
    //     const resUCs = await Api.getUCs();
    //     const ucsData = await resUCs.json();
    //     setListaUCs(ucsData.map((uc) => ({ value: uc.id, label: uc.nome })));

    //     // Definir a uc selecionada
    //     const ucEncontrado = ucsData.find((d) => d.id === mhData.ucfk);
    //     if (ucEncontrado) {
    //       setDocente({
    //         value: ucEncontrado.id,
    //         label: ucEncontrado.nome,
    //       });
    //     }

    //     // Obter a lista de salas
    //     const resSalas = await Api.getSalas();
    //     const salasData = await resSalas.json();
    //     setListaSalas(salasData.map((s) => ({ value: s.id, label: s.nome })));

    //     // Definir o docente selecionado
    //     const salaEncontrada = salasData.find((d) => d.id === mhData.salaFK);
    //     if (salaEncontrada) {
    //       setDocente({
    //         value: salaEncontrada.id,
    //         label: salaEncontrada.nome,
    //       });
    //     }
    //   } catch (err) {
    //     console.error("Erro ao carregar dados:", err);
    //     toast.error("Erro ao carregar os dados.");
    //   }
    // };
    const fetchData = async () => {
      try {
        // Buscar dados da mancha horária
        const resManchaHoraria = await Api.getDetalhesManchaHoraria(id);
        const mhData = await resManchaHoraria.json();
        // Obter a lista de UCs
        const resUCs = await Api.getUCs();
        const ucsData = await resUCs.json();
        setListaUCs(ucsData.map((uc) => ({ value: uc.id, label: uc.nome })));

        // Definir a UC selecionada
        const ucEncontrada = ucsData.find((uc) => uc.id === mhData.ucfk);
        if (ucEncontrada) {
          setUc({
            value: ucEncontrada.id,
            label: ucEncontrada.nome,
          });
        }
        // Obter a lista de docentes
        const resDocentes = await Api.getDocentes();
        const docentesData = await resDocentes.json();
        setListaDocentes(
          docentesData.map((d) => ({ value: d.id, label: d.nome }))
        );

        // Definir o docente selecionado
        const docenteEncontrado = docentesData.find(
          (d) => d.id === mhData.docenteFK
        );
        if (docenteEncontrado) {
          setDocente({
            value: docenteEncontrado.id,
            label: docenteEncontrado.nome,
          });
        }

        // Obter a lista de salas
        const resSalas = await Api.getSalas();
        const salasData = await resSalas.json();
        setListaSalas(salasData.map((s) => ({ value: s.id, label: s.nome })));

        // Definir a sala selecionada
        const salaEncontrada = salasData.find((s) => s.id === mhData.salaFK);
        if (salaEncontrada) {
          setSala({
            value: salaEncontrada.id,
            label: salaEncontrada.nome,
          });
        }

        // Configurar outros valores
        setTipoAula(mhData.tipoDeAula);
        setNumSlots(mhData.numSlots);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast.error("Erro ao carregar os dados.");
      }
    };

    fetchData();
  }, [id]);

  // Função de envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!uc || !tipoAula || !numSlots || !docente || !sala) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    // Dados a serem enviados no formato esperado pela API
    const dataASubmeter = {
      SalaFK: sala.value,
      DocenteFK: docente.value,
      TipoDeAula: tipoAula,
      NumSlots: numSlots,
      UCFK: uc.value,
    };

    console.log("Dados a enviar para a API:", dataASubmeter);

    setLoading(true);

    try {
      const res = await Api.updateManchaHoraria(id, dataASubmeter);
      const result = await res.json();

      setLoading(false);

      if (res.ok) {
        toast.success("Mancha Horária editada com sucesso!");
        navigate(ROUTES.MANCHAS_HORARIAS);
      } else {
        toast.error(result.erro || "Erro ao editar a mancha.");
      }
      
    } catch (error) {
      setLoading(false);
      toast.error("Erro ao editar a UC.");
      console.error(error);
    }
  };

  if (
    listaSalas.length === 0 ||
    listaDocentes.length === 0 ||
    listaUCs.length === 0
  ) {
    return <div>Carregando...</div>;
  }

  return (
    <EditarPage titulo="Editar Mancha Horária">
      <form onSubmit={handleSubmit}>
        <UCSSelect value={uc} onChange={setUc} options={listaUCs} />

        <DocentesSelect
          value={docente}
          onChange={setDocente}
          options={listaDocentes}
        />

        <label className="form-label">Selecione o Tipo de Aula</label>
        <Select
          style={{ marginLeft: "15px", width: "200px" }}
          labelId="tipoAula-label"
          id="tipoAula"
          value={tipoAula}
          onChange={(e) => setTipoAula(e.target.value)}
        >
          <MenuItem value="TP">TP</MenuItem>
          <MenuItem value="PL">PL</MenuItem>
        </Select>

        <SalasSelect value={sala} onChange={setSala} options={listaSalas} />

        <TextInput
          id="numSlots"
          label="Número de Slots (30 minutos)"
          type="number"
          value={numSlots}
          onChange={(e) => setNumSlots(e.target.value)}
        />
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Editar Mancha Horária" />
          <ReturnButton text="Voltar" endpoint="/manchas_horarias" />
        </div>
      </form>
    </EditarPage>
  );
}
