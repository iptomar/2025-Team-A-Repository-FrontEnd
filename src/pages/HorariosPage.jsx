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
import pt from "date-fns/locale/pt";
import "../css/horario.css";
import { getManchasHorarias, dragBloco } from "../api/api";
import * as signalR from "@microsoft/signalr";

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
          const mH = await getManchasHorarias();
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
    <div className="horario-container">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Gestão de Horários</h5>
            {horarioSelecionado && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setHorarioSelecionado(null)}
              >
                Mudar horário
              </button>
            )}
          </div>

          {!horarioSelecionado && (
            <>
              {/* Seleção */}
              <div className="mt-3 mb-3">
                <label className="form-label">
                  Selecionar horário existente
                </label>
                <select
                  className="form-select"
                  value={horarioSelecionado?.id || ""}
                  onChange={(e) => {
                    const idSelecionado = parseInt(e.target.value);
                    const horario = horarios.find(
                      (h) => h.id === idSelecionado
                    );
                    setHorarioSelecionado(horario);
                    carregarManchasDoHorario(horario.id);
                  }}
                >
                  <option value="">Selecione um horário</option>
                  {horarios.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Criação */}
              {!mostrarCriar ? (
                <button
                  className="btn btn-link p-0"
                  onClick={() => setMostrarCriar(true)}
                >
                  + Criar novo horário
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    criarHorario(novoHorarioNome);
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">Nome do novo horário</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: 2024/25 LEI 1ºA"
                      value={novoHorarioNome}
                      onChange={(e) => setNovoHorarioNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Criar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setMostrarCriar(false);
                        setNovoHorarioNome("");
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {horarioSelecionado && (
            <p className="text-muted mt-2">
              A visualizar: <strong>{horarioSelecionado.nome}</strong>
            </p>
          )}
        </div>
      </div>

      {horarioSelecionado ? (
        <>
          <div className="header">
            <button onClick={() => mudarSemana(-1)}>← Semana anterior</button>
            <h2>
              {`${format(currentWeekStart, "EEEE, dd 'de' MMMM", {
                locale: pt,
              })} - ${format(
                add(currentWeekStart, { days: 5 }),
                "EEEE, dd 'de' MMMM",
                {
                  locale: pt,
                }
              )}`}
            </h2>
            <button onClick={() => mudarSemana(1)}>Semana seguinte →</button>
          </div>
          <div className="main-grid">
            <div className="grelha">
              <div className="grelha-header">
                <div className="hora"></div>
                {diasDaSemana.map((dia) => (
                  <div key={dia} className="dia">
                    {format(dia, "EEEE, dd 'de' MMMM", { locale: pt })}
                  </div>
                ))}
              </div>
              <div className="grelha-body">
                {horas.map((hora, index) => (
                  <div key={index} className="linha">
                    <div className="hora">{format(hora, "HH:mm")}</div>
                    {diasDaSemana.map((dia) => {
                      const aulasDoDia = aulas.filter(
                        (a) =>
                          a.dia === format(dia, "yyyy-MM-dd") &&
                          a.horaInicio === format(hora, "HH:mm")
                      );

                      return (
                        <div
                          key={`${dia}-${hora}`}
                          className="slot"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const data = JSON.parse(
                              e.dataTransfer.getData("application/json")
                            );
                            const novaAula = {
                              ...data,
                              dia: format(dia, "yyyy-MM-dd"),
                              horaInicio: format(hora, "HH:mm"),
                              horaFim: format(
                                addMinutes(hora, data.duracao),
                                "HH:mm"
                              ),
                            };
                            dragBloco(
                              data.id,
                              novaAula.horaInicio,
                              novaAula.dia
                            );
                            setAulas((prev) => [...prev, novaAula]);
                            setBlocos((prev) =>
                              prev.filter((bloco) => bloco.id !== data.id)
                            );
                          }}
                        >
                          {aulasDoDia.map((aula, i) => {
                            const [hStart, mStart] = aula.horaInicio
                              .split(":")
                              .map(Number);
                            const [hEnd, mEnd] = aula.horaFim
                              .split(":")
                              .map(Number);
                            const minutosInicio = hStart * 60 + mStart;
                            const minutosFim = hEnd * 60 + mEnd;
                            const altura =
                              (minutosFim - minutosInicio) * (40 / 30);

                            const removerAula = () => {
                              setAulas((prev) =>
                                prev.filter(
                                  (a) =>
                                    !(
                                      a.cadeira === aula.cadeira &&
                                      a.professor === aula.professor &&
                                      a.dia === aula.dia &&
                                      a.horaInicio === aula.horaInicio
                                    )
                                )
                              );
                              setBlocos((prev) => [...prev, aula]);
                              dragBloco(aula.id, "00:00:00", "0001-01-01");
                            };

                            return (
                              <div
                                key={`${dia}-${hora}-${i}`}
                                className="aula"
                                style={{
                                  height: `${altura}px`,
                                  top: 0,
                                  position: "relative",
                                }}
                              >
                                <button
                                  onClick={removerAula}
                                  style={{
                                    position: "absolute",
                                    top: "4px",
                                    right: "6px",
                                    background: "transparent",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                  }}
                                  title="Remover aula"
                                >
                                  ×
                                </button>
                                <strong>{aula.cadeira}</strong>
                                <em>{aula.tipo}</em>
                                <div>{aula.professor}</div>
                                <div>{aula.sala}</div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="sidebar">
              <h3>Blocos</h3>
              {blocos.map((bloco, i) => (
                <div
                  key={i}
                  className="bloco-default"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify(bloco)
                    );
                  }}
                >
                  <strong>{bloco.cadeira}</strong> ({bloco.tipo})<br />
                  Prof. {bloco.professor}
                  <br />
                  {bloco.sala}
                  <br />
                  {bloco.duracao} min
                </div>
              ))}
            </div>
          </div>{" "}
        </>
      ) : (
        <div> </div>
      )}
    </div>
  );
};

export default HorariosPage;
