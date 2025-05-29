import React, { useEffect, useState } from "react"; // Importa React e hooks
import {
  add,
  startOfWeek,
  format,
  eachDayOfInterval,
  startOfDay,
  addMinutes,
} from "date-fns"; // Importa funções do date-fns
import pt from "date-fns/locale/pt"; // Importa locale em português
import "../css/horario.css"; // Importa CSS
import { getManchasHorarias, dragBloco } from "../api/api"; // Importa funções da API
import * as signalR from "@microsoft/signalr"; // Importa SignalR
import html2pdf from "html2pdf.js"; // Importa html2pdf

// Componente SchedulePage
// Este componente é responsável por exibir o horário de aulas
const SchedulePage = () => {

// Tratamento de download do horário em formato de PDF
const handleDownloadPDF = async () => {
  const element = document.getElementById("grelha-pdf"); // <div id="grelha-pdf">

  if (!element) { // Verifica se o elemento existe
    // Se não existir, exibe uma mensagem de erro
    console.error("Elemento da grelha não encontrado!");
    return;
  }  

  // Define as opções para o html2pdf
  // Estas opções controlam como o PDF será gerado
  const opt = {
    filename: "horario.pdf",  // Nome do arquivo
    
    // Opções para o html2canvas
    html2canvas: {            
      scale: 3                // Escala da imagem
    },
    
    // Opções para o jsPDF
    jsPDF: {
      unit: "px",             // Unidade de medida
      format: [1200, 1400],   // Formato do PDF
    },
  };
  await html2pdf().set(opt).from(element).save(); // Gera o PDF e faz o download
};

  // Estado para armazenar o início da semana atual
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Estado para armazenar as aulas e blocos
  const [aulas, setAulas] = useState([]);

  // Estado para armazenar os blocos
  const [blocos, setBlocos] = useState([]);

  // Gera uma lista de dias da semana a partir do início da semana atual
  // e adiciona 5 dias a partir do início da semana
  const diasDaSemana = eachDayOfInterval({
    start: currentWeekStart,
    end: add(currentWeekStart, { days: 5 }),
  });

  // Gera uma lista de horas, começando às 08:00 e terminando às 00:00
  const horas = Array.from({ length: 33 }, (_, i) =>
    addMinutes(startOfDay(new Date()), 480 + 30 * i)
  );

  // Função para mudar a semana atual, adicionando ou subtraindo semanas
  // com base na direção (1 para próxima semana, -1 para semana anterior)
  const mudarSemana = (direcao) => {
    const novaSemana = add(currentWeekStart, { weeks: direcao });
    setCurrentWeekStart(novaSemana);
  };

  // Função para obter as manchas horárias e formatar os dados
  useEffect(() => {
    // Função assíncrona para buscar as manchas horárias
    // e formatar os dados para exibição
    const inic = async () => {
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
        // Filtra os blocos para separar os que têm hora de início e dia
        // e formata os horários de início e fim
        const b = [];
        const a = [];
        // Itera sobre os blocos formatados
        // e adiciona os blocos sem hora de início ou dia a um array separado
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
        // Atualiza os estados com os blocos e aulas formatados
        setBlocos(b);
        // Atualiza o estado com os blocos
        setAulas(a);
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };
    // Chama a função para buscar as manchas horárias
    // e formata os dados
    inic();
  }, []);

  // Cria uma conexão SignalR
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5251/horarioHub", {
      withCredentials: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();

    // Inicia a conexão
    connection.start().then(() => {
      console.log("Ligado ao SignalR");

      // Escuta o evento "AulaAtualizada" do SignalR
      connection.on("AulaAtualizada", async (data) => {
        console.log("Aula atualizada via socket:", data);

        // Atualiza o estado com os dados recebidos
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
          // Filtra os blocos para separar os que têm hora de início e dia
          const b = [];
          const a = [];

          // Itera sobre os blocos formatados	
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
          // Atualiza os estados com os blocos e aulas formatados
          setBlocos(b);

          // Atualiza o estado com os blocos
          setAulas(a);
        } catch (error) {
          console.error("Erro ao obter os dados:", error);
        }
      });
    });

    // Para a conexão quando o componente é desmontado
    return () => {
      connection.stop();
    };
  }, []);

  // Renderiza o componente
  return (
    // Renderiza o componente SchedulePage
    // e exibe o horário de aulas
    <div className="horario-container">
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
        <div id="grelha-pdf" className="grelha"> 
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

                  // Verifica se há aulas para o dia e hora atuais
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
                        dragBloco(data.id, novaAula.horaInicio, novaAula.dia);
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
                        // Calcula a altura do bloco com base na duração da aula
                        // e na altura de cada slot (40px para 30 minutos)
                        const minutosInicio = hStart * 60 + mStart;
                        const minutosFim = hEnd * 60 + mEnd;
                        const altura = (minutosFim - minutosInicio) * (40 / 30);

                        // Função para remover a aula 
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
                          // Remove a aula do estado
                          setBlocos((prev) => [...prev, aula]);
                          // Adiciona a aula de volta aos blocos
                          // e remove do estado de aulas
                          dragBloco(aula.id, "00:00:00", "0001-01-01");
                        };

                        // Renderiza o bloco da aula
                        // e adiciona um botão para remover a aula
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
      </div>
      <button onClick={handleDownloadPDF} className="download-button flex item-center py-2 px-3">
        Baixar Horário atual
      </button>  
    </div>
  );
};

// Exporta o componente SchedulePage como padrão
export default SchedulePage;
