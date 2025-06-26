import { useEffect } from "react";
import "../css/horario.css";
import { addMinutes } from "date-fns";
import { dragBloco } from "../api/api";
import { toast } from "react-toastify";

// Função para cortar a data no formato "YYYY-MM-DD HH:mm:ss" para "YYYY-MM-DD"
const cortarData = (data) => data ? data.slice(0, -9) : "";

// Array com os nomes dos dias (1=Segunda, ..., 6=Sábado)
const nomesDias = [
  "", // 0 = não atribuído
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
];

// Componente GrelhaHorario 
// Recebe diversos props para renderizar a grelha de horários
const GrelhaHorario = ({
  horas,
  aulas,
  blocos,
  setAulas,
  setBlocos,
  bloqueado,
  anoLetivo,
  semestre,
  dataInicio,
  dataFim,
  horarioInfo,
}) => {
  // Dias da semana de 1 a 6
  const diasDaSemana = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
  const scrollSpeed = 20;
  const threshold = 100; // distância ao topo/fundo para ativar scroll

  const handleDrag = (e) => {
    const y = e.clientY;

    // Scroll para baixo
    if (window.innerHeight - y < threshold) {
      window.scrollBy(0, scrollSpeed);
    }

    // Scroll para cima
    if (y < threshold) {
      window.scrollBy(0, -scrollSpeed);
    }
  };

  window.addEventListener("dragover", handleDrag);

  return () => {
    window.removeEventListener("dragover", handleDrag);
  };
}, []);

  return (
    <div style={{ margin: "1rem" }}>
      <div className="main-grid">
        <div id="grelha-pdf" className="grelha">
          {/* Cabeçalho para o PDF - só aparece quando horarioInfo é fornecido */}
          {horarioInfo && (
            <div className="pdf-header">
              <div style={{ 
                color: '#000',
                fontSize: '16px',
                fontWeight: 'normal',
                lineHeight: '1.4'
              }}>
                {/* Quebra a string pelos separadores | e formata */}
                {horarioInfo.nome.split(' | ').map((parte, index, array) => (
                  <span key={index}>
                    <strong>{parte.trim()}</strong>
                    {index < array.length - 1 && (
                      <span style={{ margin: '0 10px' }}>|</span>
                    )}
                  </span>
                ))}
              </div>
              {/* Exibe a data de início e fim do horário, se disponíveis, no formato corretos */}
              <span>
                {dataInicio && dataFim
                  ? `${cortarData(dataInicio)} a ${cortarData(dataFim)}`
                  : cortarData(dataInicio) || cortarData(dataFim) || ""}
              </span>
            </div>
        )}
          <div className="grelha-header">
            <div className="hora"></div>
            {diasDaSemana.map((diaInt) => (
              <div key={diaInt} className="dia">
                {nomesDias[diaInt]}
              </div>
            ))}
          </div>
          <div className="grelha-body">
            {horas.map((hora, index) => (
              <div key={index} className="linha">
                <div className="hora">{hora}</div>
                {diasDaSemana.map((diaInt) => {
                  // Filtra aulas para este dia e hora
                  // Considera que a hora está no formato "HH:mm - HH:mm"
                  // Separa a hora de início
                  const horaInicioGrelha = hora.split(" - ")[0];
                  const aulasDoDia = aulas.filter(
                    (a) => a.dia === diaInt && a.horaInicio === horaInicioGrelha
                  );

                  return (
                    <div
                      key={`${diaInt}-${hora}`}
                      className="slot"
                      style={{
                        cursor: bloqueado ? "not-allowed" : "pointer",
                      }}
                      onDragOver={(e) => {
                        if (!bloqueado) e.preventDefault();
                      }}
                      onDrop={async (e) => {
                        if (bloqueado) return;
                        e.preventDefault();
                        const data = JSON.parse(
                          e.dataTransfer.getData("application/json")
                        );
                        const novaAula = {
                          ...data,
                          dia: diaInt,
                          // Define a hora de início e fim com base na duração
                          horaInicio: hora.split(" - ")[0],
                          horaFim: addMinutes(
                            new Date(`1970-01-01T${hora}`),
                            data.duracao
                          )
                            .toTimeString()
                            .slice(0, 5),
                        };
                        try {
                          await dragBloco(
                            data.id,
                            novaAula.horaInicio,
                            novaAula.dia,
                            anoLetivo,
                            semestre
                          );
                          setAulas((prev) => [...prev, novaAula]);
                          setBlocos((prev) =>
                            prev.filter((bloco) => bloco.id !== data.id)
                          );
                        } catch (error) {
                          toast.error(error.message);
                        }
                      }}
                    >
                      {aulasDoDia.map((aula, i) => {
                        const altura = (aula.duracao * 40) / 30;

                        if (bloqueado) {
                          return (
                            <div
                              key={`${diaInt}-${hora}-${i}`}
                              className="aula"
                              style={{
                                height: `${altura}px`,
                                top: 0,
                                position: "relative",
                              }}
                            >
                              <strong>{aula.cadeira}</strong>
                              <em>{aula.tipo}</em>
                              <div>{aula.professor}</div>
                              <div>{aula.sala}</div>
                            </div>
                          );
                        }
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
                          dragBloco(
                            aula.id,
                            "00:00:00",
                            0,
                            anoLetivo,
                            semestre
                          );
                        };

                        return (
                          <div
                            key={`${diaInt}-${hora}-${i}`}
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
              className={`bloco-default ${bloqueado ? "bloco-bloqueado" : ""}`}
              draggable={!bloqueado}
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const data = JSON.parse(
                  e.dataTransfer.getData("application/json")
                );
                const novaAula = {
                  ...data,
                  dia: bloco.dia,
                  horaInicio: bloco.horaInicio,
                  horaFim: addMinutes(
                    new Date(`1970-01-01T${bloco.horaInicio}`),
                    bloco.duracao
                  )
                    .toTimeString()
                    .slice(0, 5),
                };
                dragBloco(
                  data.id,
                  novaAula.horaInicio,
                  novaAula.dia,
                  anoLetivo,
                  semestre
                );
                setAulas((prev) => [...prev, novaAula]);
                setBlocos((prev) => prev.filter((b) => b.id !== data.id));
              }}
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
    </div>
  );
};

export default GrelhaHorario;
