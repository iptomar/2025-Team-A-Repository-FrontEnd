import React, { useEffect, useState } from "react";
import {
  mostrarToastBloqueado,
  mostrarToastDesbloqueado,
} from "../components/ToastHorarioBlocked.jsx";
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
import {
  getManchasPorHorario,
  getHorarioById,
  bloquearHorario,
  desbloquearHorario,
  getManchasHorariasPorSala,
  getManchasHorariasPorDocente
} from "../api/api";
import * as signalR from "@microsoft/signalr";
import GestaoHorarios from "../components/GestaoHorarios";
import GestaoHorariosSalas from "../components/GestaoHorariosSalas";
import GrelhaHorario from "../components/GrelhaHorarios";
import { Tabs, Tab, Box } from "@mui/material";
import GestaoHorariosDocentes from "../components/GestaoHorariosDocentes";

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

  const [horarioSalaSelecionado, setHorarioSalaSelecionado] = useState([]);

  // Estado para controlar a visibilidade do formulário de criação de horário
  const [mostrarCriar, setMostrarCriar] = useState(false);

  // Estado para bloquear ou desbloquear horários
  const [bloqueado, setBloqueado] = useState(false);

  // Estado para controlar a aba ativa
  const [aba, setAba] = useState(0);

  // Estado para guardar o horário do docente selecionado
  const [horarioDocenteSelecionado, setHorarioDocenteSelecionado] = useState([]);

  // Gera os dias da semana atual
  const diasDaSemana = eachDayOfInterval({
    start: currentWeekStart,
    end: add(currentWeekStart, { days: 5 }), // Inclui de segunda a sexta-feira
  });

  // Gera os horários do dia (das 8:00 às 23:30, com intervalos de 30 minutos)
  const horas = Array.from(
    { length: 33 },
    (_, i) => addMinutes(startOfDay(new Date()), 480 + 30 * i) // Começa às 8:00 (480 minutos) e adiciona intervalos de 30 minutos
  );

  // Função para mudar a semana exibida
  const mudarSemana = (direcao) => {
    const novaSemana = add(currentWeekStart, { weeks: direcao }); // Adiciona ou subtrai semanas
    setCurrentWeekStart(novaSemana); // Atualiza o estado com a nova semana
  };

  // Efeito para obter o estado de bloqueio do horário selecionado
  useEffect(() => {
    const obterEstadoBloqueado = async () => {
      if (!horarioSelecionado) return;
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

  // Função para bloquear ou desbloquear horários
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

      // Define o evento para receber atualizações de bloqueio/desbloqueio
      connection.on("HorarioBloqueado", (data) => {
        console.log("Evento HorarioBloqueado recebido:", data);
        if (data.id === horarioSelecionado?.id) {
          setBloqueado(data.bloqueado); // Atualiza o estado de bloqueio
        }
      });
    });
    // Limpa a conexão ao desmontar o componente
    return () => {
      connection.stop();
    };
  }, [horarioSelecionado]);

  // Efeito para carregar as manchas horárias ao montar o componente
  useEffect(() => {
    const inic = async () => {
      try {
        let response = null;

        if (aba === 0 && horarioSelecionado) {
          response = await getManchasPorHorario(horarioSelecionado.id);
        } else if (
          aba === 1 &&
          horarioSalaSelecionado &&
          horarioSalaSelecionado.sala &&
          horarioSalaSelecionado.anoLetivo &&
          horarioSalaSelecionado.semestre
        ) {
          setBlocos([]);
          setAulas([]);
          response = await getManchasHorariasPorSala(
            horarioSalaSelecionado.sala.value,
            horarioSalaSelecionado.anoLetivo,
            horarioSalaSelecionado.semestre
          );
        } else if (
          aba === 2 &&
          horarioDocenteSelecionado &&
          horarioDocenteSelecionado.docente &&
          horarioDocenteSelecionado.anoLetivo &&
          horarioDocenteSelecionado.semestre
        ) {
          setBlocos([]);
          setAulas([]);
          response = await getManchasHorariasPorDocente(
            horarioDocenteSelecionado.docente.value,
            horarioDocenteSelecionado.anoLetivo,
            horarioDocenteSelecionado.semestre
          );
        }

        // Só processa se houver resposta
        if (response) {
          const mH = await response.json();

          if (Array.isArray(mH)) {
            // Formata os blocos de horários recebidos
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
          }
        } else {
          console.error("Resposta da API não é um array:", response);
        }
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };
    inic();
  }, [aba, horarioSelecionado, horarioSalaSelecionado, horarioDocenteSelecionado]);

  // Efeito para configurar a conexão com o SignalR
  // Efeito para configurar a conexão com o SignalR
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
          let response = null;
          if (aba === 0 && horarioSelecionado) {
            response = await getManchasPorHorario(horarioSelecionado.id);
          } else if (
            aba === 1 &&
            horarioSalaSelecionado &&
            horarioSalaSelecionado.sala &&
            horarioSalaSelecionado.anoLetivo &&
            horarioSalaSelecionado.semestre
          ) {
            setBlocos([]);
            setAulas([]);
            response = await getManchasHorariasPorSala(
              horarioSalaSelecionado.sala.value,
              horarioSalaSelecionado.anoLetivo,
              horarioSalaSelecionado.semestre
            );
          } else if (
            aba === 2 &&
            horarioDocenteSelecionado &&
            horarioDocenteSelecionado.docente &&
            horarioDocenteSelecionado.anoLetivo &&
            horarioDocenteSelecionado.semestre
          ) {
            setBlocos([]);
            setAulas([]);
            response = await getManchasHorariasPorDocente(
              horarioDocenteSelecionado.docente.value,
              horarioDocenteSelecionado.anoLetivo,
              horarioDocenteSelecionado.semestre
            );
          }

          if (response) {
            const mH = await response.json();

            if (Array.isArray(mH)) {
              // Formata os blocos de horários recebidos
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
            }
          } else {
            console.error("Resposta da API não é um array:", response);
          }
        } catch (error) {
          console.error("Erro ao obter os dados:", error);
        }
      });
    });

    return () => {
      connection.stop();
    };
  }, [aba, horarioSelecionado, horarioSalaSelecionado, horarioDocenteSelecionado]);
  const handleChange = (event, newValue) => {
    console.log("Aba selecionada:", newValue);
    setAba(newValue);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Abas com Material UI */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", margin: "1rem 0" }}>
        <Tabs value={aba} onChange={handleChange} aria-label="Abas de horários">
          <Tab label="Horários das Turmas" />
          <Tab label="Horários das Salas" />
          <Tab label="Horários dos Docentes" />
        </Tabs>
      </Box>

      {/* Conteúdo das Abas */}
      {aba === 0 && (
        <>
          <GestaoHorarios
            horarioSelecionado={horarioSelecionado}
            setHorarioSelecionado={setHorarioSelecionado}
            mostrarCriar={mostrarCriar}
            setMostrarCriar={setMostrarCriar}
          />
          {horarioSelecionado && (
            <>
              <div style={{ margin: "1rem" }}>
                {bloqueado ? (
                  <button
                    onClick={async () => {
                      try {
                        await desbloquearHorario(horarioSelecionado.id);
                        setBloqueado(false);
                        mostrarToastDesbloqueado();
                      } catch (error) {
                        console.error("Erro ao desbloquear o horário:", error);
                      }
                    }}
                  >
                    Desbloquear horário
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await bloquearHorario(horarioSelecionado.id);
                        setBloqueado(true);
                        mostrarToastBloqueado();
                      } catch (error) {
                        console.error("Erro ao bloquear o horário:", error);
                      }
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
            </>
          )}
        </>
      )}

      {aba === 1 && (
        <div>
          <GestaoHorariosSalas
            horarioSalaSelecionado={horarioSalaSelecionado}
            setHorarioSalaSelecionado={setHorarioSalaSelecionado}
          />
          {horarioSalaSelecionado &&
          horarioSalaSelecionado.sala &&
          horarioSalaSelecionado.anoLetivo &&
          horarioSalaSelecionado.semestre ? (
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
          ) : null}
        </div>
      )}

      {aba === 2 && (
        <div>
          <GestaoHorariosDocentes
            horarioDocenteSelecionado={horarioDocenteSelecionado}
            setHorarioDocenteSelecionado={setHorarioDocenteSelecionado}
          />
          {horarioDocenteSelecionado &&
          horarioDocenteSelecionado.docente &&
          horarioDocenteSelecionado.anoLetivo &&
          horarioDocenteSelecionado.semestre ? (
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
          ) : null}
        </div>
      )}
    </>
  );
};

export default HorariosPage;
