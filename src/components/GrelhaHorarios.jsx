import React from "react";
import { format, addMinutes } from "date-fns";
import pt from "date-fns/locale/pt";
import "../css/horario.css";
import { dragBloco } from "../api/api";
import { toast } from "react-toastify";

const GrelhaHorario = ({
  diasDaSemana,
  horas,
  aulas,
  blocos,
  setAulas,
  setBlocos,
  mudarSemana,
}) => {
  return (
    <div style={{ margin: "1rem" }}>
      <div className="header">
        <button onClick={() => mudarSemana(-1)}>← Semana anterior</button>
        <h2>
          {`${format(diasDaSemana[0], "EEEE, dd 'de' MMMM", {
            locale: pt,
          })} - ${format(
            diasDaSemana[diasDaSemana.length - 1],
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
                      onDrop={async (e) => {
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
                        try {
                          await dragBloco(
                            data.id,
                            novaAula.horaInicio,
                            novaAula.dia
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
      </div>
    </div>
  );
};

export default GrelhaHorario;
