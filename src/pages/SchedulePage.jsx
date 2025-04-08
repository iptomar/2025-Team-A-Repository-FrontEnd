import React, { useEffect, useState } from "react";
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
import { getManchasHorarias, adicionarManchaHoraria, getDocentes } from "../api/api";

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
    professor: 0,
    sala: "",
    dia: format(currentWeekStart, "yyyy-MM-dd"),
    horaInicio: "09:00",
    horaFim: "10:00",
  });

  const [formData, setFormData] = useState({
    horaInicio: novaAula.horaInicio,
    diaSemana: novaAula.dia,
    tipoAula: '',
    numSlots: 0,
    docenteFK: 0,
    salaFK: 0,
    ucFK: 0
});

  const [docentes, setDocentes] = useState([]);

  
  const mudarSemana = (direcao) => {
    const novaSemana = add(currentWeekStart, { weeks: direcao });
    setCurrentWeekStart(novaSemana);
  };
  const adicionarAula = () => {
    setAulas([...aulas, novaAula]);
    setNovaAula({ ...novaAula, cadeira: "", professor: "" });

    const blocos = calcularBlocos(novaAula.horaInicio, novaAula.horaFim);

    console.log(novaAula);
    console.log(blocos);
    if(blocos <= 0 || novaAula.professor <= 0|| novaAula.sala === "" || novaAula.cadeira === "" || novaAula.tipo === ""){ 
      alert("A aula não pode ter uma duração negativa ou zero.");
      return;
    }
    
    setFormData({
      tipoAula: novaAula.tipo,
      numSlots: blocos,
      horaInicio: novaAula.horaInicio,
      diaSemana: novaAula.dia,
      docenteFK: 1,
      salaFK: 1,
      ucFK: 1,
    });

    console.log(formData);

    adicionarManchaHoraria(formData);
  };

  const calcularBlocos = (inicio, fim) => {
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fim.split(":").map(Number);
  
    const minutosInicio = h1 * 60 + m1;
    const minutosFim = h2 * 60 + m2;
  
    const duracao = minutosFim - minutosInicio;
    const blocos = duracao / 30;
  
    return blocos;
  };
  

  useEffect(() => {
    const inic = async () => {
      try {
        //vai buscar os docentes
        const d = await getDocentes();
        setDocentes(d);
  
        const mH = await getManchasHorarias();
        setAulas(mH);
  
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };
    inic();
    
  }, []); 

  return (
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

      <form
        className="formulario"
        onSubmit={(e) => {
          e.preventDefault(); 
          adicionarAula(); 
        }}
      >
        <h3>Adicionar Aula</h3>

        <div className="campo-form">
          <label htmlFor="cadeira">Cadeira</label>
          <input
            id="cadeira"
            placeholder="Nome da cadeira"
            value={novaAula.cadeira}
            onChange={(e) =>
              setNovaAula({ ...novaAula, cadeira: e.target.value })
            }
          />
        </div>

        <div className="campo-form">
          <label htmlFor="tipo">Tipo</label>
          <select
            id="tipo"
            value={novaAula.tipo}
            onChange={(e) => setNovaAula({ ...novaAula, tipo: e.target.value })}
          >
            <option value="TP">TP</option>
            <option value="PL">PL</option>
          </select>
        </div>

        <div className="campo-form">
          <label htmlFor="professor">Professor</label>
          <select
            id="professor"
            value={novaAula.professor}
            onChange={(e) =>
              setNovaAula({ ...novaAula, professor: e.target.value })
            }
          >
            {docentes.map((docente) => (
              <option key={docente.id} value={docente.id}> {docente.nome} </option>
            ))}
          </select>
        </div>

        <div className="campo-form">
          <label htmlFor="sala">Sala</label>
          <select
            id="sala"
            value={novaAula.sala}
            onChange={(e) => setNovaAula({ ...novaAula, sala: e.target.value })}
          >
            <option value="Sala 101">Sala 101</option>
            <option value="Sala 102">Sala 102</option>
          </select>
        </div>

        <div className="campo-form">
          <label htmlFor="dia">Data</label>
          <input
            id="dia"
            type="date"
            value={novaAula.dia}
            onChange={(e) => setNovaAula({ ...novaAula, dia: e.target.value })}
          />
        </div>

        <div className="campo-form">
          <label htmlFor="horaInicio">Hora de Início</label>
          <input
            id="horaInicio"
            type="time"
            value={novaAula.horaInicio}
            onChange={(e) =>
              setNovaAula({ ...novaAula, horaInicio: e.target.value })
            }
          />
        </div>

        <div className="campo-form">
          <label htmlFor="horaFim">Hora de Fim</label>
          <input
            id="horaFim"
            type="time"
            value={novaAula.horaFim}
            onChange={(e) =>
              setNovaAula({ ...novaAula, horaFim: e.target.value })
            }
          />
        </div>

        <button type="submit">Adicionar Aula</button>
      </form>

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
                  <div key={`${dia}-${hora}`} className="slot">
                    {aulasDoDia.map((aula, i) => {
                      const [hStart, mStart] = aula.horaInicio
                        .split(":")
                        .map(Number);
                      const [hEnd, mEnd] = aula.horaFim.split(":").map(Number);
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
