import React, { useEffect, useState } from "react";
import {
  add,
  startOfWeek,
  format,
  eachDayOfInterval,
  startOfDay,
  addMinutes,
  // set,
} from "date-fns";
import "../css/horario.css";
import { getManchasHorarias } from "../api/api";
import * as signalR from "@microsoft/signalr";
import GestaoHorarios from "../components/GestaoHorarios";
import GrelhaHorario from "../components/GrelhaHorarios";

const HorariosPage = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [aulas, setAulas] = useState([]);

  const [blocos, setBlocos] = useState([]);
  const diasDaSemana = eachDayOfInterval({
    start: currentWeekStart,
    end: add(currentWeekStart, { days: 5 }),
  });

  const horas = Array.from({ length: 33 }, (_, i) =>
    addMinutes(startOfDay(new Date()), 480 + 30 * i)
  );

  const mudarSemana = (direcao) => {
    const novaSemana = add(currentWeekStart, { weeks: direcao });
    setCurrentWeekStart(novaSemana);
  };
  ////////////////////////////////////////////////////////////////
  const horariosExemplo = [
    { id: 1, nome: "2024/25 LEI 1ºA" },
    { id: 2, nome: "2024/25 LEI 2ºB" },
  ];
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [mostrarCriar, setMostrarCriar] = useState(false);
  const [novoHorarioNome, setNovoHorarioNome] = useState("");

  // Carregar lista de horários (simulação ou chamada à API)
  useEffect(() => {
    // Substituir por chamada real à API
    setHorarios(horariosExemplo);
  }, []);

  const criarHorario = async (nome) => {
    try {
      // Criar novo horário via API
      const novo = { id: Date.now(), nome };
      setHorarios((prev) => [...prev, novo]);
      setHorarioSelecionado(novo);
      setMostrarCriar(false);
      setNovoHorarioNome("");
      carregarManchasDoHorario(novo.id);
    } catch (err) {
      console.error("Erro ao criar horário:", err);
    }
  };

  const carregarManchasDoHorario = (id) => {
    console.log("Carregar manchas do horário:", id);
    // Chamada para ir buscar as manchas desse horário específico
    // setAulas(...) etc.
  };
  ///////////////////////////////////////////////////////
  useEffect(() => {
    const inic = async () => {
      try {
        const response = await getManchasHorarias();
        const mH = await response.json();
        const blocosFormatados = mH.map((bloco) => ({
          id: bloco.id,
          cadeira: bloco.uc.nome,
          tipo: bloco.tipoDeAula,
          horaInicio: bloco.horaInicio,
          dia: bloco.dia,
          professor: bloco.docente.nome,
          sala: bloco.sala.nome,
          duracao: bloco.numSlots * 30,
        }));
        const b = [];
        const a = [];
        blocosFormatados.forEach((element) => {
          if (
            element.horaInicio === "00:00:00" ||
            element.dia === "0001-01-01"
          ) {
            b.push(element);
          }
          a.push({
            ...element,
            horaInicio: format(
              new Date(`1970-01-01T${element.horaInicio}`),
              "HH:mm"
            ),
            horaFim: format(
              addMinutes(
                new Date(`1970-01-01T${element.horaInicio}`),
                element.duracao
              ),
              "HH:mm"
            ),
          });
        });
        setBlocos(b);
        setAulas(a);
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };
    inic();
  }, []);

  // Cria uma conexão SignalR
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:7008/horarioHub", {
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Ligado ao SignalR");

      connection.on("AulaAtualizada", async (data) => {
        console.log("Aula atualizada via socket:", data);

        try {
          const response = await getManchasHorarias();
          const mH = await response.json();
          const blocosFormatados = mH.map((bloco) => ({
            id: bloco.id,
            cadeira: bloco.uc.nome,
            tipo: bloco.tipoDeAula,
            horaInicio: bloco.horaInicio,
            dia: bloco.dia,
            professor: bloco.docente.nome,
            sala: bloco.sala.nome,
            duracao: bloco.numSlots * 30,
          }));
          const b = [];
          const a = [];
          blocosFormatados.forEach((element) => {
            if (
              element.horaInicio === "00:00:00" ||
              element.dia === "0001-01-01"
            ) {
              b.push(element);
            }
            a.push({
              ...element,
              horaInicio: format(
                new Date(`1970-01-01T${element.horaInicio}`),
                "HH:mm"
              ),
              horaFim: format(
                addMinutes(
                  new Date(`1970-01-01T${element.horaInicio}`),
                  element.duracao
                ),
                "HH:mm"
              ),
            });
          });
          setBlocos(b);
          setAulas(a);
        } catch (error) {
          console.error("Erro ao obter os dados:", error);
        }
      });
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <>
      <GestaoHorarios
        horarios={horarios}
        horarioSelecionado={horarioSelecionado}
        setHorarioSelecionado={setHorarioSelecionado}
        mostrarCriar={mostrarCriar}
        setMostrarCriar={setMostrarCriar}
        novoHorarioNome={novoHorarioNome}
        setNovoHorarioNome={setNovoHorarioNome}
        criarHorario={criarHorario}
        carregarManchasDoHorario={carregarManchasDoHorario}
      />

      {horarioSelecionado && (
        <GrelhaHorario
          diasDaSemana={diasDaSemana}
          horas={horas}
          aulas={aulas}
          blocos={blocos}
          setAulas={setAulas}
          setBlocos={setBlocos}
          mudarSemana={mudarSemana}
        />
      )}
    </>
  );
};

export default HorariosPage;
