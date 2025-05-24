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
import Select from "react-select";
import { Select as MUISelect, MenuItem } from "@mui/material";
import { ROUTES } from "../../Routes";
import customDarkStyles from "../../css/darkmode";

export default function EditarManchaHoraria() {
  const [uc, setUc] = useState(null);
  const [tipoAula, setTipoAula] = useState(null);
  const [numSlots, setNumSlots] = useState(0);
  const [docente, setDocente] = useState(null);
  const [sala, setSala] = useState(null);
  const [listaDocentes, setListaDocentes] = useState([]);
  const [listaUCs, setListaUCs] = useState([]);
  const [listaSalas, setListaSalas] = useState([]);
  const [listaHorarios, setListaHorarios] = useState([]);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const navigate = useNavigate();
  const { id } = useParams();

  // Quando o utilizador muda os horarios selecionados
  const handleSelectChange = (selected) => {
    setHorariosSelecionados(selected || []);
  };

  // Carregar dados da turma e horarios disponíveis
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados da mancha horária
        const resManchaHoraria = await Api.getDetalhesManchaHoraria(id);
        const mhData = await resManchaHoraria.json();

        // Obter os horários
        const response = await Api.getHorarios();
        const h = await response.json();
        const horariosFormatados = h.map((bloco) => ({
          value: bloco.id,
          label:
            bloco.anoLetivo +
            " " +
            bloco.turmaCurso +
            " " +
            bloco.semestre +
            " " +
            bloco.anoCurso +
            " " +
            bloco.nomeTurma,
        }));
        setListaHorarios(horariosFormatados);

        // Pré-selecionar os horários
        const horariosSelecionadosMapeados = (mhData.listaHorarios || []).map(
          (hor) => {
            const horarioEncontrado = horariosFormatados.find(
              (h) => h.value === hor.id
            );
            return {
              value: hor.id,
              label: horarioEncontrado?.label || "Horário desconhecido",
            };
          }
        );

        setHorariosSelecionados(horariosSelecionadosMapeados);

        // Obter a lista de UCs
        const resUCs = await Api.getUCs();
        const ucsData = await resUCs.json();
        const ucsOptions = ucsData.map((uc) => ({
          value: uc.id,
          label: uc.nome,
        }));
        setListaUCs(ucsOptions);

        // Definir a UC selecionada
        const ucEncontrada = ucsOptions.find((uc) => uc.value === mhData.uc.id);
        if (ucEncontrada) setUc(ucEncontrada);

        // Obter a lista de docentes
        const resDocentes = await Api.getDocentes();
        const docentesData = await resDocentes.json();
        const docentesOptions = docentesData.map((d) => ({
          value: d.id,
          label: d.nome,
        }));
        setListaDocentes(docentesOptions);

        // Definir o docente selecionado
        const docenteEncontrado = docentesOptions.find(
          (d) => d.value === mhData.docente.id
        );
        if (docenteEncontrado) setDocente(docenteEncontrado);

        // Obter a lista de salas
        const resSalas = await Api.getSalas();
        const salasData = await resSalas.json();
        const salasOptions = salasData.map((s) => ({
          value: s.id,
          label: s.nome,
        }));
        setListaSalas(salasOptions);

        // Definir a sala selecionada
        const salaEncontrada = salasOptions.find(
          (s) => s.value === mhData.sala.id
        );
        if (salaEncontrada) setSala(salaEncontrada);

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

    if (
      !uc ||
      !tipoAula ||
      !numSlots ||
      !docente ||
      !sala ||
      !horariosSelecionados
    ) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    let listaHorariosIds = [];
    horariosSelecionados.forEach((element) => {
      console.log(element.value);
      listaHorariosIds.push(element.value);
    });
    // Dados a serem enviados no formato esperado pela API
    const dataASubmeter = {
      SalaFK: sala.value,
      DocenteFK: docente.value,
      TipoDeAula: tipoAula,
      NumSlots: numSlots,
      UCFK: uc.value,
      HorariosIds: listaHorariosIds,
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
        toast.error(result.erro || "Erro ao editar a Mancha Horária.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Erro ao editar a Mancha Horária.");
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
        <MUISelect
          style={{ marginLeft: "15px", width: "200px" }}
          labelId="tipoAula-label"
          id="tipoAula"
          value={tipoAula}
          onChange={(e) => setTipoAula(e.target.value)}
        >
          <MenuItem value="TP">TP</MenuItem>
          <MenuItem value="PL">PL</MenuItem>
        </MUISelect>

        <SalasSelect value={sala} onChange={setSala} options={listaSalas} />

        <TextInput
          id="numSlots"
          label="Número de Slots (30 minutos)"
          type="number"
          value={numSlots}
          onChange={(e) => setNumSlots(e.target.value)}
        />
        <div className="mb-3">
          <label htmlFor="cursos" className="form-label">
            Horários associados
          </label>
          <Select
            isMulti={true}
            options={listaHorarios}
            value={horariosSelecionados}
            onChange={handleSelectChange}
            styles={isDarkMode ? customDarkStyles : {}}
          />
        </div>
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Editar Mancha Horária" />
          <ReturnButton text="Voltar" endpoint="/manchas_horarias" />
        </div>
      </form>
    </EditarPage>
  );
}
