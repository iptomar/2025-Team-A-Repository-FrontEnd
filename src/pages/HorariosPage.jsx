import React, { useEffect, useState } from "react";
import { mostrarToastBloqueado, mostrarToastDesbloqueado } from '../components/ToastHorarioBlocked.jsx'
import { ToastContainer } from "react-toastify";
import {
  add,
  startOfWeek,
  format,
  eachDayOfInterval,
  startOfDay,
  addMinutes,
} from "date-fns";
import "../css/horario.css";
import { getManchasHorarias, getHorarioById, bloquearHorario, desbloquearHorario } from "../api/api";
import * as signalR from "@microsoft/signalr";
import GestaoHorarios from "../components/GestaoHorarios";
import GrelhaHorario from "../components/GrelhaHorarios";

const HorariosPage = () => {
  // Estado para guardar o início da semana atual
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Define o início da semana como segunda-feira
  );

  // Estado para guardar as aulas formatadas
  const [aulas, setAulas] = useState([]);

  // Estado para guardar blocos de horários não alocados
  const [blocos, setBlocos] = useState([]);

  // Estado para guardar o horário atualmente selecionado
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  // Estado para controlar a visibilidade do formulário de criação de horário
  const [mostrarCriar, setMostrarCriar] = useState(false);

  // Estado para bloquear ou desbloquear horários
  const [bloqueado, setBloqueado] = useState(false);

  // Gera os dias da semana atual
  const diasDaSemana = eachDayOfInterval({
    start: currentWeekStart,
    end: add(currentWeekStart, { days: 5 }), // Inclui de segunda a sexta-feira
  });

  // Gera os horários do dia (das 8:00 às 23:30, com intervalos de 30 minutos)
  const horas = Array.from({ length: 33 }, (_, i) =>
    addMinutes(startOfDay(new Date()), 480 + 30 * i) // Começa às 8:00 (480 minutos) e adiciona intervalos de 30 minutos
  );

  // Função para mudar a semana exibida
  const mudarSemana = (direcao) => {
    const novaSemana = add(currentWeekStart, { weeks: direcao }); // Adiciona ou subtrai semanas
    setCurrentWeekStart(novaSemana); // Atualiza o estado com a nova semana
  };

  // Função para bloquear ou desbloquear horários
  useEffect(() => {
  const obterEstadoBloqueado = async () => {
    if (!horarioSelecionado) return;
    // Obter o estado bloqueado do horário selecionado
    try {
      const response = await getHorarioById(horarioSelecionado.id);
      const data = await response.json();
      setBloqueado(data.bloqueado);
    } catch (error) {
      console.error("Erro ao obter estado bloqueado:", error);
    }
  };
  obterEstadoBloqueado();
}, [horarioSelecionado]);

  // Efeito para carregar as manchas horárias ao montar o componente
  useEffect(() => {
    const inic = async () => {
      try {
        // Obtém as manchas horárias da API
        const response = await getManchasHorarias();
        const mH = await response.json();

        // Formata os blocos de horários recebidos
        const blocosFormatados = mH.map((bloco) => ({
          id: bloco.id,
          cadeira: bloco.uc.nome,
          tipo: bloco.tipoDeAula,
          horaInicio: bloco.horaInicio,
          dia: bloco.dia,
          professor: bloco.docente.nome,
          sala: bloco.sala.nome,
          duracao: bloco.numSlots * 30, // Duração em minutos
        }));

        const b = []; // Blocos não alocados
        const a = []; // Aulas formatadas

        // Processa os blocos para separar os não alocados e formatar os horários
        blocosFormatados.forEach((element) => {
          if (
            element.horaInicio === "00:00:00" || // Verifica se o horário não está definido
            element.dia === "0001-01-01" // Verifica se o dia não está definido
          ) {
            b.push(element); // Adiciona aos blocos não alocados
          }
          a.push({
            ...element,
            horaInicio: format(
              new Date(`1970-01-01T${element.horaInicio}`),
              "HH:mm"
            ), // Formata a hora de início
            horaFim: format(
              addMinutes(
                new Date(`1970-01-01T${element.horaInicio}`),
                element.duracao
              ),
              "HH:mm"
            ), // Calcula e formata a hora de término
          });
        });

        setBlocos(b); // Atualiza o estado com os blocos não alocados
        setAulas(a); // Atualiza o estado com as aulas formatadas
      } catch (error) {
        console.error("Erro ao obter os dados:", error); // Loga erros no console
      }
    };
    inic(); // Chama a função de inicialização
  }, []);

  // Efeito para configurar a conexão com o SignalR
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:7008/horarioHub", {
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets, // Usa WebSockets para comunicação
      })
      .withAutomaticReconnect() // Reconecta automaticamente em caso de desconexão
      .build();

    // Inicia a conexão
    connection.start().then(() => {
      console.log("Ligado ao SignalR");

      // Define o evento para receber atualizações de aulas
      connection.on("AulaAtualizada", async (data) => {
        console.log("Aula atualizada via socket:", data);

        try {
          // Atualiza as manchas horárias ao receber uma atualização
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

    // Limpa a conexão ao desmontar o componente
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Componente para gerenciar horários */}
      <GestaoHorarios
        horarioSelecionado={horarioSelecionado}
        setHorarioSelecionado={setHorarioSelecionado}
        mostrarCriar={mostrarCriar}
        setMostrarCriar={setMostrarCriar}
      />

      {/* Exibe a grelha de horários se um horário estiver selecionado */}
      {horarioSelecionado && (
        <>
        <div style={{ margin: "1rem" }}>
          {/* Botão para bloquear ou desbloquear o horário */}
          {bloqueado ? (
            <button
              onClick={async () => {
                await desbloquearHorario(horarioSelecionado.id);
                mostrarToastDesbloqueado();
                setBloqueado(false);
              }}
            >
              Desbloquear horário
            </button>
          ) : (
            <button
              onClick={async () => {
                await bloquearHorario(horarioSelecionado.id);
                mostrarToastBloqueado();
                setBloqueado(true);
              }}
            >
              Bloquear horário
            </button>
          )}
        </div>
        <GrelhaHorario
          diasDaSemana={diasDaSemana}
          horas={horas}
          aulas={aulas}
          blocos={blocos}
          setAulas={setAulas}
          setBlocos={setBlocos}
          mudarSemana={mudarSemana}
          bloqueado={bloqueado}
        />
      </>)}
    </>
  );
};

export default HorariosPage;