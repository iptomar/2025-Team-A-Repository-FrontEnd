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
import Toast from "../components/Toast";
import "../css/horario.css";

const SchedulePage = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [aulas, setAulas] = useState([]);
  const [toastVisivel, setToastVisivel] = useState(false);
  const [toastMensagem, setToastMensagem] = useState("");

  const diasDaSemana = eachDayOfInterval({
    start: currentWeekStart,
    end: add(currentWeekStart, { days: 5 }),
  });

  const horas = Array.from({ length: 33 }, (_, i) =>
    addMinutes(startOfDay(new Date()), 30 * i + 480)
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
    if (
      novaAula.cadeira.trim() &&
      novaAula.professor.trim() &&
      novaAula.sala.trim()
    ) {
      setAulas([...aulas, novaAula]);
      setNovaAula({ ...novaAula, cadeira: "", professor: "" });
      setToastMensagem("Aula adicionada com sucesso!");
    } else {
      setToastMensagem("Erro: Preencha todos os campos obrigatórios.");
    }
    setToastVisivel(true);
  };

  const mudarSemana = (direcao) => {
    const novaSemana = add(currentWeekStart, { weeks: direcao });
    setCurrentWeekStart(novaSemana);
  };

  return (
    <div className="horario-container">
      <div className="header">
        <button onClick={() => mudarSemana(-1)}>← Semana anterior</button>
        <h2>{`${format(currentWeekStart, "EEEE, dd 'de' MMMM", { locale: pt })} - ${format(
          add(currentWeekStart, { days: 5 }),
          "EEEE, dd 'de' MMMM",
          { locale: pt }
        )}`}</h2>
        <button onClick={() => mudarSemana(1)}>Semana seguinte →</button>
      </div>

      <div className="formulario">
        <h3>Adicionar Aula</h3>
        <label>
          Cadeira
          <input
            placeholder="Cadeira"
            value={novaAula.cadeira}
            onChange={(e) => setNovaAula({ ...novaAula, cadeira: e.target.value })}
          />
        </label>
        <label>
          Tipo de Aula
          <select
            value={novaAula.tipo}
            onChange={(e) => setNovaAula({ ...novaAula, tipo: e.target.value })}
          >
            <option value="TP">TP</option>
            <option value="PL">PL</option>
          </select>
        </label>
        <label>
          Professor
          <input
            placeholder="Professor"
            value={novaAula.professor}
            onChange={(e) => setNovaAula({ ...novaAula, professor: e.target.value })}
          />
        </label>
        <label>
          Sala
          <select
            value={novaAula.sala}
            onChange={(e) => setNovaAula({ ...novaAula, sala: e.target.value })}
          >
            <option value="Sala 101">Sala 101</option>
            <option value="Sala 102">Sala 102</option>
          </select>
        </label>
        <label>
          Data
          <input
            type="date"
            value={novaAula.dia}
            onChange={(e) => setNovaAula({ ...novaAula, dia: e.target.value })}
          />
        </label>
        <label>
          Hora de Início
          <input
            type="time"
            value={novaAula.horaInicio}
            onChange={(e) => setNovaAula({ ...novaAula, horaInicio: e.target.value })}
          />
        </label>
        <label>
          Hora de Fim
          <input
            type="time"
            value={novaAula.horaFim}
            onChange={(e) => setNovaAula({ ...novaAula, horaFim: e.target.value })}
          />
        </label>
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
                const aula = aulas.find(
                  (a) =>
                    a.dia === format(dia, "yyyy-MM-dd") &&
                    a.horaInicio === format(hora, "HH:mm")
                );
                if (aula) {
                  const [h1, m1] = aula.horaInicio.split(":").map(Number);
                  const [h2, m2] = aula.horaFim.split(":").map(Number);
                  const duracaoMinutos = (h2 * 60 + m2) - (h1 * 60 + m1);
                  const altura = (duracaoMinutos / 30) * 40;

                  return (
                    <div
                      key={`${dia}-${hora}`}
                      className="aula"
                      style={{ height: `${altura}px` }}
                    >
                      <strong>{aula.cadeira}</strong>
                      <em>{aula.tipo}</em>
                      <div>{aula.professor}</div>
                      <div>{aula.sala}</div>
                    </div>
                  );
                }
                return <div key={`${dia}-${hora}`} className="slot"></div>;
              })}
            </div>
          ))}
        </div>
      </div>

      <Toast
        message={toastMensagem}
        show={toastVisivel}
        onClose={() => setToastVisivel(false)}
      />
    </div>
  );
};

export default SchedulePage;
