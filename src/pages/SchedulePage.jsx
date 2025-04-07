import React, { useState } from "react";
import {
  add,
  startOfWeek,
  format,
  eachDayOfInterval,
  startOfDay,
  addMinutes,
} from "date-fns";
import pt from "date-fns/locale/pt";
import "../css/horario.css";

const SchedulePage = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [aulas, setAulas] = useState([]);

  const diasDaSemana = eachDayOfInterval({
    start: currentWeekStart,
    end: add(currentWeekStart, { days: 5 }),
  });

  const horas = Array.from({ length: 33 }, (_, i) =>
    addMinutes(startOfDay(new Date()), 480 + 30 * i)
  );

  const [novaAula, setNovaAula] = useState({
    cadeira: "",
    tipo: "TP",
    professor: "",
    sala: "",
    dia: format(currentWeekStart, "yyyy-MM-dd"),
    horaInicio: "09:00",
    horaFim: "10:00",
  });

  const adicionarAula = () => {
    setAulas([...aulas, novaAula]);
    setNovaAula({ ...novaAula, cadeira: "", professor: "" });
  };

  const mudarSemana = (direcao) => {
    const novaSemana = add(currentWeekStart, { weeks: direcao });
    setCurrentWeekStart(novaSemana);
  };

  return (
    <div className="horario-container">
      <div className="header">
        <button onClick={() => mudarSemana(-1)}>← Semana anterior</button>
        <h2>{`${format(currentWeekStart, "EEEE, dd 'de' MMMM", {
          locale: pt,
        })} - ${format(add(currentWeekStart, { days: 5 }), "EEEE, dd 'de' MMMM", {
          locale: pt,
        })}`}</h2>
        <button onClick={() => mudarSemana(1)}>Semana seguinte →</button>
      </div>

      <div className="formulario">
        <h3>Adicionar Aula</h3>

        <div className="campo-form">
            <label htmlFor="cadeira">Cadeira</label>
            <input id="cadeira" placeholder="Nome da cadeira" value={novaAula.cadeira} onChange={(e) => setNovaAula({ ...novaAula, cadeira: e.target.value })} />
        </div>

        <div className="campo-form">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" value={novaAula.tipo} onChange={(e) => setNovaAula({ ...novaAula, tipo: e.target.value })}>
            <option value="TP">TP</option>
            <option value="PL">PL</option>
            </select>
        </div>

        <div className="campo-form">
            <label htmlFor="professor">Professor</label>
            <input id="professor" placeholder="Nome do professor" value={novaAula.professor} onChange={(e) => setNovaAula({ ...novaAula, professor: e.target.value })} />
        </div>

        <div className="campo-form">
            <label htmlFor="sala">Sala</label>
            <select id="sala" value={novaAula.sala} onChange={(e) => setNovaAula({ ...novaAula, sala: e.target.value })}>
            <option value="Sala 101">Sala 101</option>
            <option value="Sala 102">Sala 102</option>
            </select>
        </div>

        <div className="campo-form">
            <label htmlFor="dia">Data</label>
            <input id="dia" type="date" value={novaAula.dia} onChange={(e) => setNovaAula({ ...novaAula, dia: e.target.value })} />
        </div>

        <div className="campo-form">
            <label htmlFor="horaInicio">Hora de Início</label>
            <input id="horaInicio" type="time" value={novaAula.horaInicio} onChange={(e) => setNovaAula({ ...novaAula, horaInicio: e.target.value })} />
        </div>

        <div className="campo-form">
            <label htmlFor="horaFim">Hora de Fim</label>
            <input id="horaFim" type="time" value={novaAula.horaFim} onChange={(e) => setNovaAula({ ...novaAula, horaFim: e.target.value })} />
        </div>

        <button onClick={adicionarAula}>Adicionar Aula</button>
        </div>


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
                  (a) => a.dia === format(dia, "yyyy-MM-dd") && a.horaInicio === format(hora, "HH:mm")
                );

                return (
                  <div key={`${dia}-${hora}`} className="slot">
                    {aulasDoDia.map((aula, i) => {
                      const [hStart, mStart] = aula.horaInicio.split(":" ).map(Number);
                      const [hEnd, mEnd] = aula.horaFim.split(":" ).map(Number);
                      const minutosInicio = hStart * 60 + mStart;
                      const minutosFim = hEnd * 60 + mEnd;
                      const altura = (minutosFim - minutosInicio) * (40 / 30);

                      return (
                        <div
                          key={`${dia}-${hora}-${i}`}
                          className="aula"
                          style={{ height: `${altura}px`, top: 0 }}
                        >
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
    </div>
  );
};

export default SchedulePage;
